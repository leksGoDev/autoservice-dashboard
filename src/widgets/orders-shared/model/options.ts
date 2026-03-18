import type { OrderStatus } from "@/entities/order/model/types";

import type { UiOrderPriority } from "./types";

export const ORDER_STATUSES: OrderStatus[] = [
  "scheduled",
  "in_progress",
  "waiting_parts",
  "completed",
  "cancelled",
];

export const ORDER_PRIORITIES: UiOrderPriority[] = ["low", "medium", "high"];
