import type { OrderPriority, OrderStatus } from "@/entities/order/model/types";

export interface OrdersTableRow {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleLabel: string;
  status: OrderStatus;
  priority: OrderPriority;
  flagged: boolean;
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
