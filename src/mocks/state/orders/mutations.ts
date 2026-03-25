import type {
  AddJobPartPayload,
  AddServiceJobPayload,
  OrderPartItem,
  OrderServiceJob,
  OrderStatus,
  ServiceJobStatus,
} from "@/entities/order/model/types";
import { getActualHours, normalizeMoney } from "./initial";
import {
  addActivity,
  findOrderAndJobIndex,
  findOrderAndPartIndex,
  findOrderIndex,
  getMutableOrderByIndex,
  setUpdated,
  syncDerivedOrderFields,
  toOrderSnapshot,
} from "./store";
import type { MockOrderStateItem } from "./types";

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
