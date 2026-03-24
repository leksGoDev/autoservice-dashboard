import type { OrderCustomerSnapshot, ServiceJobStatus } from "@/entities/order/model/types";

export function getJobStatusBadgeModifier(status: ServiceJobStatus) {
  if (status === "pending") {
    return "scheduled";
  }

  return status.replace("_", "-");
}

export function getLoyaltyTierBadgeClass(loyaltyTier: OrderCustomerSnapshot["loyaltyTier"]) {
  const map: Record<OrderCustomerSnapshot["loyaltyTier"], string> = {
    standard: "bg-[rgba(148,163,184,0.2)] text-slate-200",
    silver: "bg-[rgba(107,164,255,0.2)] text-[var(--color-accent-light-blue)]",
    gold: "bg-[rgba(245,158,11,0.18)] text-amber-200",
  };

  return map[loyaltyTier];
}

export function formatOrderHours(value: number) {
  return `${value.toFixed(1)}h`;
}

export function formatOrderActivityTimestamp(value: string) {
  return new Date(value).toLocaleString();
}
