import styles from "./StatusBadges.module.css";

export function getStatusBadgeClass(modifier: string) {
  const map: Record<string, string> = {
    pending: styles.statusPending,
    confirmed: styles.statusConfirmed,
    scheduled: styles.statusScheduled,
    "in-progress": styles.statusInProgress,
    "waiting-parts": styles.statusWaitingParts,
    completed: styles.statusCompleted,
    cancelled: styles.statusCancelled,
    converted: styles.statusConverted,
  };

  return [styles.statusChip, map[modifier] ?? ""].join(" ").trim();
}

export function getPriorityBadgeClass(priority: string) {
  const map: Record<string, string> = {
    low: styles.priorityLow,
    medium: styles.priorityMedium,
    high: styles.priorityHigh,
    urgent: styles.priorityUrgent,
  };

  return map[priority] ?? "";
}
