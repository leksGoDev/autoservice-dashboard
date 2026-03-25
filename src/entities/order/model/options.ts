import type { OrderPriority, OrderStatus, ServiceJobStatus } from "./types";

export const ORDER_STATUSES: OrderStatus[] = [
  "scheduled",
  "in_progress",
  "waiting_parts",
  "completed",
  "cancelled",
];

export const ORDER_PRIORITIES: OrderPriority[] = ["low", "medium", "high"];

export const SERVICE_JOB_STATUSES: ServiceJobStatus[] = [
  "pending",
  "in_progress",
  "waiting_parts",
  "completed",
];
