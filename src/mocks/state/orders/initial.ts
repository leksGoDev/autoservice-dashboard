import type {
  OrderActivityItem,
  OrderActivityType,
  OrderPartItem,
  OrderServiceJob,
  OrderStatus,
  ServiceJobStatus,
} from "@/entities/order/model/types";
import {
  orderJobCatalogFixture,
  orderMechanicsFixture,
  orderPartCatalogFixture,
  ordersFixture,
  type OrderFixtureItem,
} from "@/mocks/fixtures/orders";
import type { MockOrderStateItem } from "./types";

export function getPriority(totalAmount: number): MockOrderStateItem["priority"] {
  if (totalAmount >= 900) {
    return "high";
  }

  if (totalAmount >= 500) {
    return "medium";
  }

  return "low";
}

export function normalizeMoney(value: number) {
  return Number(Math.max(0, value).toFixed(2));
}

function getServiceJobStatus(orderStatus: OrderStatus, index: number, jobsCount: number): ServiceJobStatus {
  if (orderStatus === "scheduled") {
    return "pending";
  }

  if (orderStatus === "completed") {
    return "completed";
  }

  if (orderStatus === "cancelled") {
    return index === 0 ? "completed" : "pending";
  }

  if (orderStatus === "waiting_parts") {
    return index === jobsCount - 1 ? "waiting_parts" : "completed";
  }

  return index === jobsCount - 1 ? "in_progress" : "completed";
}

export function getActualHours(estimatedHours: number, status: ServiceJobStatus) {
  if (status === "pending") {
    return 0;
  }

  if (status === "in_progress") {
    return Number(Math.max(0.5, estimatedHours - 0.4).toFixed(1));
  }

  if (status === "waiting_parts") {
    return Number(estimatedHours.toFixed(1));
  }

  return Number((estimatedHours + 0.3).toFixed(1));
}

function buildInitialJobs(order: OrderFixtureItem, assignedMechanic: string, jobsCount: number): OrderServiceJob[] {
  return Array.from({ length: jobsCount }, (_, index) => {
    const catalogItem =
      orderJobCatalogFixture[(Number(order.id.replace(/\D/g, "")) + index) % orderJobCatalogFixture.length];
    const status = getServiceJobStatus(order.status, index, jobsCount);
    const estimatedHours = Number((catalogItem.estimatedHours + index * 0.4).toFixed(1));

    return {
      id: `${order.id}_job_${index + 1}`,
      name: catalogItem.name,
      category: catalogItem.category,
      status,
      assignedMechanic,
      estimatedHours,
      actualHours: getActualHours(estimatedHours, status),
      laborPrice: Math.round((estimatedHours + (status === "completed" ? 0.2 : 0)) * catalogItem.laborRate),
    };
  });
}

function buildInitialParts(
  order: OrderFixtureItem,
  priority: MockOrderStateItem["priority"],
  jobs: OrderServiceJob[],
): OrderPartItem[] {
  const targetPartsCount = Math.max(1, Math.min(jobs.length + (priority === "high" ? 1 : 0), 4));

  return Array.from({ length: targetPartsCount }, (_, index) => {
    const catalogItem =
      orderPartCatalogFixture[(Number(order.id.replace(/\D/g, "")) + index) % orderPartCatalogFixture.length];
    const quantity = (index % 2) + 1;
    const job = jobs[index % jobs.length];

    return {
      id: `${order.id}_part_${index + 1}`,
      jobId: job.id,
      jobName: job.name,
      name: catalogItem.name,
      quantity,
      unitPrice: catalogItem.unitPrice,
      totalPrice: normalizeMoney(catalogItem.unitPrice * quantity),
    };
  });
}

export function createActivityItem(
  orderId: string,
  sequence: number,
  type: OrderActivityType,
  timestamp: string,
  actor: string,
  description: string,
): OrderActivityItem {
  return {
    id: `${orderId}_activity_${sequence}`,
    type,
    timestamp,
    actor,
    description,
  };
}

function buildInitialActivity(order: OrderFixtureItem & { assignedMechanic: string }, jobs: OrderServiceJob[], parts: OrderPartItem[]) {
  const createdAt = new Date(order.createdAt).getTime();
  const updatedAt = new Date(order.updatedAt).getTime();
  const betweenTimestamps = Math.max(60 * 60 * 1000, updatedAt - createdAt);

  const baseEvents: OrderActivityItem[] = [
    createActivityItem(
      order.id,
      1,
      "order_created",
      new Date(createdAt).toISOString(),
      "Service Advisor",
      `Work order ${order.number} was created for ${order.vehicleLabel}.`,
    ),
    createActivityItem(
      order.id,
      2,
      "order_scheduled",
      new Date(createdAt + Math.round(betweenTimestamps * 0.18)).toISOString(),
      "Front Desk",
      "Visit window confirmed and the bay slot reserved.",
    ),
    createActivityItem(
      order.id,
      3,
      "mechanic_assigned",
      new Date(createdAt + Math.round(betweenTimestamps * 0.34)).toISOString(),
      "Dispatcher",
      `${order.assignedMechanic} was assigned to the order.`,
    ),
    createActivityItem(
      order.id,
      4,
      "job_added",
      new Date(createdAt + Math.round(betweenTimestamps * 0.48)).toISOString(),
      order.assignedMechanic,
      `${jobs[0]?.name ?? "Service job"} was added to the work scope.`,
    ),
    createActivityItem(
      order.id,
      5,
      "part_added",
      new Date(createdAt + Math.round(betweenTimestamps * 0.65)).toISOString(),
      "Parts Desk",
      `${parts[0]?.name ?? "Part"} was added to the order parts list.`,
    ),
    createActivityItem(
      order.id,
      6,
      "status_changed",
      new Date(createdAt + Math.round(betweenTimestamps * 0.82)).toISOString(),
      order.assignedMechanic,
      `Order status updated to ${order.status.replace("_", " ")}.`,
    ),
  ];

  if (order.status === "completed") {
    baseEvents.push(
      createActivityItem(
        order.id,
        7,
        "order_completed",
        new Date(updatedAt).toISOString(),
        "Service Advisor",
        "Order completed and ready for customer pickup.",
      ),
    );
  }

  return baseEvents.sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());
}

function toMockOrderStateItem(item: OrderFixtureItem): MockOrderStateItem {
  const mechanicIndex = Number(item.id.replace(/\D/g, "")) % orderMechanicsFixture.length;
  const priority = getPriority(item.totalAmount);
  const assignedMechanic = orderMechanicsFixture[mechanicIndex];
  const jobsCount = Math.max(1, Math.round(item.totalAmount / 260));
  const jobs = buildInitialJobs(item, assignedMechanic, jobsCount);
  const parts = buildInitialParts(item, priority, jobs);
  const activity = buildInitialActivity(
    {
      ...item,
      assignedMechanic,
    },
    jobs,
    parts,
  );

  return {
    ...item,
    priority,
    assignedMechanic,
    jobsCount,
    flagged: priority === "high" || item.status === "waiting_parts",
    jobs,
    parts,
    activity,
    nextJobSequence: jobs.length + 1,
    nextPartSequence: parts.length + 1,
    nextActivitySequence: activity.length + 1,
  };
}

export function buildInitialOrdersState() {
  return ordersFixture.map(toMockOrderStateItem);
}
