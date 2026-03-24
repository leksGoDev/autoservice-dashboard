import {
  formatOrderCurrency as formatOrderCurrencyBase,
  formatOrderDate as formatOrderDateBase,
  getOrderStatusChipModifier as getOrderStatusChipModifierBase,
} from "@/entities/order/model/presentation";

export const getOrderStatusChipModifier = getOrderStatusChipModifierBase;

export function formatOrderDate(dateIso: string) {
  return formatOrderDateBase(dateIso);
}

export function formatOrderCurrency(value: number) {
  return formatOrderCurrencyBase(value);
}
