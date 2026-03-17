import type { RecentActivityType, RecentOrderItem } from "./types";

type ActivityTone = "neutral" | "success" | "warning" | "danger";
type WorkloadTone = "normal" | "warning" | "danger";

const STATUS_LABELS: Record<RecentOrderItem["status"], string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  waiting_parts: "Waiting Parts",
  completed: "Completed",
  cancelled: "Cancelled",
};

const PRIORITY_LABELS: Record<RecentOrderItem["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const ACTIVITY_TONES: Record<RecentActivityType, ActivityTone> = {
  order_created: "neutral",
  order_scheduled: "neutral",
  status_changed: "success",
  mechanic_assigned: "neutral",
  parts_updated: "warning",
};

export const KPI_CARD_CONFIG = [
  { id: "active", label: "Active Orders" },
  { id: "overdue", label: "Overdue Orders" },
  { id: "scheduled", label: "Scheduled Orders" },
  { id: "today", label: "Revenue Today" },
  { id: "month", label: "Revenue This Month" },
] as const;

export function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

export function formatDashboardChartDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatDashboardDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString();
}

export function formatRelativeTime(dateIso: string) {
  const timestamp = new Date(dateIso).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(0, Math.round((now - timestamp) / 60000));

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} h ago`;
  }

  return formatDashboardDate(dateIso);
}

export function getActivityTone(type: RecentActivityType): ActivityTone {
  return ACTIVITY_TONES[type];
}

export function formatOrderStatus(status: RecentOrderItem["status"]) {
  return STATUS_LABELS[status];
}

export function formatOrderPriority(priority: RecentOrderItem["priority"]) {
  return PRIORITY_LABELS[priority];
}

export function getStatusChipModifier(status: RecentOrderItem["status"]) {
  return status.replace("_", "-");
}

export function getWorkloadTone(utilization: number): WorkloadTone {
  if (utilization >= 90) {
    return "danger";
  }

  if (utilization >= 75) {
    return "warning";
  }

  return "normal";
}
