import type { OrderStatus } from "@/entities/order/model/types";
import { formatDate, formatUsd, toStatusModifier } from "@/shared/lib/presentation";

export function getOrderStatusChipModifier(status: OrderStatus) {
  return toStatusModifier(status);
}

export function formatOrderDate(dateIso: string) {
  return formatDate(dateIso);
}

export function formatOrderCurrency(value: number) {
  return formatUsd(value);
}
