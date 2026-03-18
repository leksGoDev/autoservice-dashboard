import type { OrderStatus } from "@/entities/order/model/types";

export type UiOrderPriority = "low" | "medium" | "high";

export interface OrdersTableRow {
  id: string;
  number: string;
  customerName: string;
  vehicleLabel: string;
  status: OrderStatus;
  priority: UiOrderPriority;
  assignedMechanic: string;
  jobsCount: number;
  totalAmount: number;
  createdAt: string;
}

export interface OrdersToolbarFilters {
  search: string;
  status: "" | OrderStatus;
  priority: "" | UiOrderPriority;
  mechanic: string;
  createdFrom: string;
  createdTo: string;
}
