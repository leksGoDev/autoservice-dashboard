import type { OrderStatus } from "@/entities/order/model/types";

export function getOrderStatusChipModifier(status: OrderStatus) {
  return status.replace("_", "-");
}

export function formatOrderDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString();
}

export function formatOrderCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}
