import type { OrderActivityType } from "@/entities/order/model/types";
import { buildInitialOrdersState, createActivityItem, getPriority } from "./initial";
import type { MockOrderStateItem } from "./types";

let ordersState = buildInitialOrdersState();

function cloneOrderStateItem(item: MockOrderStateItem): MockOrderStateItem {
  return {
    ...item,
    jobs: item.jobs.map((job) => ({ ...job })),
    parts: item.parts.map((part) => ({ ...part })),
    activity: item.activity.map((event) => ({ ...event })),
  };
}

export function addActivity(order: MockOrderStateItem, type: OrderActivityType, actor: string, description: string) {
  const timestamp = new Date().toISOString();
  const activityItem = createActivityItem(
    order.id,
    order.nextActivitySequence,
    type,
    timestamp,
    actor,
    description,
  );

  order.nextActivitySequence += 1;
  order.activity = [activityItem, ...order.activity].sort(
    (left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
  );
}

export function findOrderIndex(orderId: string) {
  return ordersState.findIndex((order) => order.id === orderId);
}

export function findOrderAndJobIndex(jobId: string) {
  const orderIndex = ordersState.findIndex((order) => order.jobs.some((job) => job.id === jobId));

  if (orderIndex < 0) {
    return null;
  }

  const jobIndex = ordersState[orderIndex].jobs.findIndex((job) => job.id === jobId);

  if (jobIndex < 0) {
    return null;
  }

  return {
    orderIndex,
    jobIndex,
  };
}

export function findOrderAndPartIndex(partId: string) {
  const orderIndex = ordersState.findIndex((order) => order.parts.some((part) => part.id === partId));

  if (orderIndex < 0) {
    return null;
  }

  const partIndex = ordersState[orderIndex].parts.findIndex((part) => part.id === partId);

  if (partIndex < 0) {
    return null;
  }

  return {
    orderIndex,
    partIndex,
  };
}

export function setUpdated(order: MockOrderStateItem) {
  order.updatedAt = new Date().toISOString();
}

export function syncDerivedOrderFields(order: MockOrderStateItem) {
  order.jobsCount = order.jobs.length;
  order.priority = getPriority(order.totalAmount);
}

export function resetOrdersMockState() {
  ordersState = buildInitialOrdersState();
}

export function getOrdersMockState(): MockOrderStateItem[] {
  return ordersState.map(cloneOrderStateItem);
}

export function getOrderMockState(orderId: string): MockOrderStateItem | undefined {
  const item = ordersState.find((order) => order.id === orderId);
  return item ? cloneOrderStateItem(item) : undefined;
}

export function getMutableOrderByIndex(index: number) {
  return ordersState[index];
}

export function toOrderSnapshot(order: MockOrderStateItem): MockOrderStateItem {
  return cloneOrderStateItem(order);
}
