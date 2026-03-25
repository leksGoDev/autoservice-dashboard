import type { OrderListItem, OrderStatus } from "@/entities/order/model/types";
import {
  orderMechanicsFixture,
  ordersFixture,
  type OrderFixtureItem,
} from "@/mocks/fixtures/orders";

export type MockOrderStateItem = OrderListItem & {
  flagged: boolean;
};

function getPriority(totalAmount: number): MockOrderStateItem["priority"] {
  if (totalAmount >= 900) {
    return "high";
  }

  if (totalAmount >= 500) {
    return "medium";
  }

  return "low";
}

function toMockOrderStateItem(item: OrderFixtureItem): MockOrderStateItem {
  const mechanicIndex = Number(item.id.replace(/\D/g, "")) % orderMechanicsFixture.length;
  const priority = getPriority(item.totalAmount);

  return {
    ...item,
    priority,
    assignedMechanic: orderMechanicsFixture[mechanicIndex],
    jobsCount: Math.max(1, Math.round(item.totalAmount / 260)),
    flagged: priority === "high" || item.status === "waiting_parts",
  };
}

function buildInitialOrdersState() {
  return ordersFixture.map(toMockOrderStateItem);
}

let ordersState = buildInitialOrdersState();

function cloneStateItem(item: MockOrderStateItem): MockOrderStateItem {
  return {
    ...item,
  };
}

export function resetOrdersMockState() {
  ordersState = buildInitialOrdersState();
}

export function getOrdersMockState(): MockOrderStateItem[] {
  return ordersState.map(cloneStateItem);
}

export function getOrderMockState(orderId: string): MockOrderStateItem | undefined {
  const item = ordersState.find((order) => order.id === orderId);
  return item ? cloneStateItem(item) : undefined;
}

export function updateOrderStatusState(orderId: string, status: OrderStatus): MockOrderStateItem | undefined {
  const index = ordersState.findIndex((order) => order.id === orderId);

  if (index < 0) {
    return undefined;
  }

  const next = {
    ...ordersState[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  ordersState[index] = next;
  return cloneStateItem(next);
}

export function assignOrderMechanicState(orderId: string, assignedMechanic: string): MockOrderStateItem | undefined {
  const index = ordersState.findIndex((order) => order.id === orderId);

  if (index < 0) {
    return undefined;
  }

  const next = {
    ...ordersState[index],
    assignedMechanic,
    updatedAt: new Date().toISOString(),
  };

  ordersState[index] = next;
  return cloneStateItem(next);
}

export function setOrderFlagState(orderId: string, flagged: boolean): MockOrderStateItem | undefined {
  const index = ordersState.findIndex((order) => order.id === orderId);

  if (index < 0) {
    return undefined;
  }

  const next = {
    ...ordersState[index],
    flagged,
    updatedAt: new Date().toISOString(),
  };

  ordersState[index] = next;
  return cloneStateItem(next);
}
