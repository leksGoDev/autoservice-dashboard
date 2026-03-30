import styles from "./StatusBadges.module.css";

type StatusBadgeModifier =
  | "pending"
  | "confirmed"
  | "scheduled"
  | "in-progress"
  | "waiting-parts"
  | "completed"
  | "cancelled"
  | "converted";

type PriorityBadgeModifier = "low" | "medium" | "high" | "urgent";

const statusBadgeClassMap = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  scheduled: styles.statusScheduled,
  "in-progress": styles.statusInProgress,
  "waiting-parts": styles.statusWaitingParts,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
  converted: styles.statusConverted,
} satisfies Record<StatusBadgeModifier, string>;

const priorityBadgeClassMap = {
  low: styles.priorityLow,
  medium: styles.priorityMedium,
  high: styles.priorityHigh,
  urgent: styles.priorityUrgent,
} satisfies Record<PriorityBadgeModifier, string>;

function isStatusBadgeModifier(value: string): value is StatusBadgeModifier {
  return value in statusBadgeClassMap;
}

function isPriorityBadgeModifier(value: string): value is PriorityBadgeModifier {
  return value in priorityBadgeClassMap;
}

export function getStatusBadgeClass(modifier: string) {
  const modifierClassName = isStatusBadgeModifier(modifier) ? statusBadgeClassMap[modifier] : "";
  return [styles.statusChip, modifierClassName].join(" ").trim();
}

export function getPriorityBadgeClass(priority: string) {
  return isPriorityBadgeModifier(priority) ? priorityBadgeClassMap[priority] : "";
}
