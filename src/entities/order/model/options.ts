import type { OrderPriority, OrderStatus } from "./types";

export const ORDER_STATUSES: OrderStatus[] = [
  "scheduled",
  "in_progress",
  "waiting_parts",
  "completed",
  "cancelled",
];

export const ORDER_PRIORITIES: OrderPriority[] = ["low", "medium", "high"];
