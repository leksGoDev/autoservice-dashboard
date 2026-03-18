import type { RecentActivityType, RecentOrderItem } from "./types";

type ActivityTone = "neutral" | "success" | "warning" | "danger";
type WorkloadTone = "normal" | "warning" | "danger";

const STATUS_LABEL_KEYS: Record<RecentOrderItem["status"], string> = {
  scheduled: "order.status.scheduled",
  in_progress: "order.status.in_progress",
  waiting_parts: "order.status.waiting_parts",
  completed: "order.status.completed",
  cancelled: "order.status.cancelled",
};

const PRIORITY_LABEL_KEYS: Record<RecentOrderItem["priority"], string> = {
  low: "order.priority.low",
  medium: "order.priority.medium",
  high: "order.priority.high",
};

const ACTIVITY_TONES: Record<RecentActivityType, ActivityTone> = {
  order_created: "neutral",
  order_scheduled: "neutral",
  status_changed: "success",
  mechanic_assigned: "neutral",
  parts_updated: "warning",
};

export const KPI_CARD_CONFIG = [
  { id: "active", labelKey: "dashboard.kpi.active" },
  { id: "overdue", labelKey: "dashboard.kpi.overdue" },
  { id: "scheduled", labelKey: "dashboard.kpi.scheduled" },
  { id: "today", labelKey: "dashboard.kpi.today" },
  { id: "month", labelKey: "dashboard.kpi.month" },
] as const;

export function formatCurrency(value: number, locale?: string) {
  return `$${value.toLocaleString(locale)}`;
}

export function formatDashboardChartDate(dateIso: string, locale?: string) {
  return new Date(dateIso).toLocaleDateString(locale, { month: "short", day: "numeric" });
}

export function formatDashboardDate(dateIso: string, locale?: string) {
  return new Date(dateIso).toLocaleDateString(locale);
}

export function formatRelativeTime(dateIso: string, locale?: string) {
  const timestamp = new Date(dateIso).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(0, Math.round((now - timestamp) / 60000));
  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  });

  if (diffMinutes < 1) {
    return rtf.format(0, "minute");
  }

  if (diffMinutes < 60) {
    return rtf.format(-diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return rtf.format(-diffHours, "hour");
  }

  return formatDashboardDate(dateIso, locale);
}

export function getActivityTone(type: RecentActivityType): ActivityTone {
  return ACTIVITY_TONES[type];
}

export function getOrderStatusKey(status: RecentOrderItem["status"]) {
  return STATUS_LABEL_KEYS[status];
}

export function getOrderPriorityKey(priority: RecentOrderItem["priority"]) {
  return PRIORITY_LABEL_KEYS[priority];
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
