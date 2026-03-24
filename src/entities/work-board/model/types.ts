import type { OrderPriority, OrderStatus } from "@/entities/order/model/types";

export type WorkBoardStatus = Extract<OrderStatus, "scheduled" | "in_progress" | "waiting_parts" | "completed">;

export type WorkBoardQuickAction = "start_work" | "wait_parts" | "complete" | "reschedule";

export interface WorkBoardCard {
  id: string;
  orderId: string;
  orderNumber: string;
  status: WorkBoardStatus;
  priority: OrderPriority;
  customerName: string;
  vehicleLabel: string;
  assignedMechanic: string;
  jobsCount: number;
  totalAmount: number;
  shortContext: string;
  updatedAt: string;
  availableActions: WorkBoardQuickAction[];
}

export interface WorkBoardColumn {
  status: WorkBoardStatus;
  cards: WorkBoardCard[];
}

export interface WorkBoardData {
  columns: WorkBoardColumn[];
  totalCards: number;
  updatedAt: string;
}
