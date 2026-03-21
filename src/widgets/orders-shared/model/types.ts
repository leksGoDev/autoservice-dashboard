import type { OrderPriority, OrderStatus } from "@/entities/order/model/types";

export interface OrdersTableRow {
  id: string;
  number: string;
  customerName: string;
  vehicleLabel: string;
  status: OrderStatus;
  priority: OrderPriority;
  assignedMechanic: string;
  jobsCount: number;
  totalAmount: number;
  createdAt: string;
}

export interface OrdersToolbarFilters {
  search: string;
  status: "" | OrderStatus;
  priority: "" | OrderPriority;
  mechanic: string;
  createdFrom: string;
  createdTo: string;
}
