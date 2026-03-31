import type { MechanicWorkloadItem } from "@/entities/dashboard/model/types";
import { getWorkloadTone } from "@/entities/dashboard/model/presentation";

export const COMPACT_VISIBLE_ITEMS_LIMIT = 3;

type WorkloadTone = ReturnType<typeof getWorkloadTone>;

export const workloadToneClassMap: Record<WorkloadTone, string> = {
  normal: "bg-[rgba(34,197,94,0.2)] text-[#bbf7d0]",
  warning: "bg-[rgba(245,158,11,0.2)] text-[#fde68a]",
  danger: "bg-[rgba(239,68,68,0.2)] text-[#fecaca]",
};

export function getVisibleMechanicWorkloadItems(items: MechanicWorkloadItem[], compact: boolean) {
  return compact ? items.slice(0, COMPACT_VISIBLE_ITEMS_LIMIT) : items;
}
