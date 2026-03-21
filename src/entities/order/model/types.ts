import type { SortDirection } from "@/shared/api/types";

export type OrderStatus =
  | "scheduled"
  | "in_progress"
  | "waiting_parts"
  | "completed"
  | "cancelled";

export type OrderPriority = "low" | "medium" | "high";

export interface OrderListItem {
  id: string;
  number: string;
  status: OrderStatus;
  priority: OrderPriority;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleLabel: string;
  assignedMechanic: string;
  jobsCount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: OrderStatus;
  priority?: OrderPriority;
  assignedMechanic?: string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: "createdAt" | "updatedAt" | "totalAmount";
  sortDirection?: SortDirection;
}
