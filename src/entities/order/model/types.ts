import type { SortDirection } from "@/shared/api/types";

export type OrderStatus =
  | "scheduled"
  | "in_progress"
  | "waiting_parts"
  | "completed"
  | "cancelled";

export interface OrderListItem {
  id: string;
  number: string;
  status: OrderStatus;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleLabel: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: OrderStatus;
  sortBy?: "createdAt" | "updatedAt" | "totalAmount";
  sortDirection?: SortDirection;
}
