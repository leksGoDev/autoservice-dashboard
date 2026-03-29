import type {
  AddJobPartPayload,
  AddServiceJobPayload,
  OrderPartItem,
  OrderServiceJob,
  OrderStatus,
  ServiceJobStatus,
} from "@/entities/order/model/types";
import { createActivityItem, getActualHours, getPriority, normalizeMoney } from "./initial";
import {
  addActivity,
  appendOrderState,
  findOrderAndJobIndex,
  findOrderAndPartIndex,
  findOrderIndex,
  getOrdersMockState,
  getMutableOrderByIndex,
  setUpdated,
  syncDerivedOrderFields,
  toOrderSnapshot,
} from "./store";
import type { MockOrderStateItem } from "./types";

type CreateOrderFromAppointmentPayload = {
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleLabel: string;
  assignedMechanic: string;
  serviceLabel: string;
  estimatedDurationMin: number;
};

export function updateOrderStatusState(orderId: string, status: OrderStatus): MockOrderStateItem | undefined {
  const index = findOrderIndex(orderId);

  if (index < 0) {
    return undefined;
  }

  const order = getMutableOrderByIndex(index);
  order.status = status;
  setUpdated(order);
  addActivity(order, "status_changed", order.assignedMechanic, `Order status updated to ${status.replace("_", " ")}.`);

  return toOrderSnapshot(order);
}

export function assignOrderMechanicState(orderId: string, assignedMechanic: string): MockOrderStateItem | undefined {
  const index = findOrderIndex(orderId);

  if (index < 0) {
    return undefined;
  }

  const order = getMutableOrderByIndex(index);
  order.assignedMechanic = assignedMechanic;
  setUpdated(order);
  addActivity(order, "mechanic_assigned", "Dispatcher", `${assignedMechanic} was assigned to the order.`);

  return toOrderSnapshot(order);
}

export function setOrderFlagState(orderId: string, flagged: boolean): MockOrderStateItem | undefined {
  const index = findOrderIndex(orderId);

  if (index < 0) {
    return undefined;
  }

  const order = getMutableOrderByIndex(index);
  order.flagged = flagged;
  setUpdated(order);

  return toOrderSnapshot(order);
}

export function addServiceJobState(orderId: string, payload: AddServiceJobPayload): MockOrderStateItem | undefined {
  const index = findOrderIndex(orderId);

  if (index < 0) {
    return undefined;
  }

  const order = getMutableOrderByIndex(index);
  const job: OrderServiceJob = {
    id: `${order.id}_job_${order.nextJobSequence}`,
    name: payload.name,
    category: payload.category,
    status: "pending",
    assignedMechanic: payload.assignedMechanic ?? order.assignedMechanic,
    estimatedHours: Number(payload.estimatedHours.toFixed(1)),
    actualHours: 0,
    laborPrice: normalizeMoney(payload.laborPrice),
  };

  order.nextJobSequence += 1;
  order.jobs.push(job);
  order.totalAmount = normalizeMoney(order.totalAmount + job.laborPrice);
  setUpdated(order);
  syncDerivedOrderFields(order);
  addActivity(order, "job_added", job.assignedMechanic, `${job.name} was added to the work scope.`);

  return toOrderSnapshot(order);
}

export function updateServiceJobStatusState(jobId: string, status: ServiceJobStatus): MockOrderStateItem | undefined {
  const match = findOrderAndJobIndex(jobId);

  if (!match) {
    return undefined;
  }

  const order = getMutableOrderByIndex(match.orderIndex);
  const job = order.jobs[match.jobIndex];

  job.status = status;
  job.actualHours = getActualHours(job.estimatedHours, status);
  setUpdated(order);
  addActivity(order, "job_status_updated", job.assignedMechanic, `${job.name} status updated to ${status.replace("_", " ")}.`);

  return toOrderSnapshot(order);
}

export function assignServiceJobMechanicState(jobId: string, assignedMechanic: string): MockOrderStateItem | undefined {
  const match = findOrderAndJobIndex(jobId);

  if (!match) {
    return undefined;
  }

  const order = getMutableOrderByIndex(match.orderIndex);
  const job = order.jobs[match.jobIndex];

  job.assignedMechanic = assignedMechanic;
  setUpdated(order);
  addActivity(order, "job_mechanic_assigned", "Dispatcher", `${assignedMechanic} was assigned to ${job.name}.`);

  return toOrderSnapshot(order);
}

export function addJobPartState(jobId: string, payload: AddJobPartPayload): MockOrderStateItem | undefined {
  const match = findOrderAndJobIndex(jobId);

  if (!match) {
    return undefined;
  }

  const order = getMutableOrderByIndex(match.orderIndex);
  const job = order.jobs[match.jobIndex];
  const partTotal = normalizeMoney(payload.quantity * payload.unitPrice);
  const part: OrderPartItem = {
    id: `${order.id}_part_${order.nextPartSequence}`,
    jobId: job.id,
    jobName: job.name,
    name: payload.name,
    quantity: payload.quantity,
    unitPrice: normalizeMoney(payload.unitPrice),
    totalPrice: partTotal,
  };

  order.nextPartSequence += 1;
  order.parts.push(part);
  order.totalAmount = normalizeMoney(order.totalAmount + part.totalPrice);
  setUpdated(order);
  syncDerivedOrderFields(order);
  addActivity(order, "part_added", "Parts Desk", `${part.name} was added to ${job.name}.`);

  return toOrderSnapshot(order);
}

export function updateJobPartQuantityState(partId: string, quantity: number): MockOrderStateItem | undefined {
  const match = findOrderAndPartIndex(partId);

  if (!match) {
    return undefined;
  }

  const order = getMutableOrderByIndex(match.orderIndex);
  const part = order.parts[match.partIndex];
  const nextTotal = normalizeMoney(part.unitPrice * quantity);

  order.totalAmount = normalizeMoney(order.totalAmount - part.totalPrice + nextTotal);
  part.quantity = quantity;
  part.totalPrice = nextTotal;

  setUpdated(order);
  syncDerivedOrderFields(order);
  addActivity(order, "part_quantity_updated", "Parts Desk", `${part.name} quantity updated to ${quantity}.`);

  return toOrderSnapshot(order);
}

export function removeJobPartState(partId: string): MockOrderStateItem | undefined {
  const match = findOrderAndPartIndex(partId);

  if (!match) {
    return undefined;
  }

  const order = getMutableOrderByIndex(match.orderIndex);
  const [removedPart] = order.parts.splice(match.partIndex, 1);

  order.totalAmount = normalizeMoney(order.totalAmount - removedPart.totalPrice);
  setUpdated(order);
  syncDerivedOrderFields(order);
  addActivity(order, "part_removed", "Parts Desk", `${removedPart.name} was removed from the order.`);

  return toOrderSnapshot(order);
}

export function createOrderFromAppointmentState(payload: CreateOrderFromAppointmentPayload): MockOrderStateItem {
  const existingOrders = getOrdersMockState();
  const maxOrderId = existingOrders.reduce((max, item) => {
    const numericId = Number(item.id.replace(/\D/g, ""));
    return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
  }, 0);
  const maxOrderNumber = existingOrders.reduce((max, item) => {
    const numericNumber = Number(item.number.replace(/\D/g, ""));
    return Number.isFinite(numericNumber) ? Math.max(max, numericNumber) : max;
  }, 1000);
  const nextOrderId = `ord_${String(maxOrderId + 1).padStart(3, "0")}`;
  const nextOrderNumber = `ORD-${maxOrderNumber + 1}`;
  const estimatedHours = Number((payload.estimatedDurationMin / 60).toFixed(1));
  const laborPrice = normalizeMoney(Math.max(80, estimatedHours * 120));
  const now = new Date().toISOString();

  const order: MockOrderStateItem = {
    id: nextOrderId,
    number: nextOrderNumber,
    status: "scheduled",
    priority: getPriority(laborPrice),
    flagged: false,
    customerId: payload.customerId,
    customerName: payload.customerName,
    vehicleId: payload.vehicleId,
    vehicleLabel: payload.vehicleLabel,
    assignedMechanic: payload.assignedMechanic,
    jobsCount: 1,
    totalAmount: laborPrice,
    createdAt: now,
    updatedAt: now,
    jobs: [
      {
        id: `${nextOrderId}_job_1`,
        name: payload.serviceLabel,
        category: "Diagnostics",
        status: "pending",
        assignedMechanic: payload.assignedMechanic,
        estimatedHours,
        actualHours: 0,
        laborPrice,
      },
    ],
    parts: [],
    activity: [
      createActivityItem(
        nextOrderId,
        2,
        "order_scheduled",
        now,
        "Scheduler",
        `Order converted from appointment and scheduled for ${payload.serviceLabel}.`,
      ),
      createActivityItem(
        nextOrderId,
        1,
        "order_created",
        now,
        "Scheduler",
        `Work order ${nextOrderNumber} was created from appointment conversion.`,
      ),
    ],
    nextJobSequence: 2,
    nextPartSequence: 1,
    nextActivitySequence: 3,
  };

  appendOrderState(order);
  return toOrderSnapshot(order);
}
