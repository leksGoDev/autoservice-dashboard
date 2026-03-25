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
  flagged: boolean;
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

export type ServiceJobStatus = "pending" | "in_progress" | "waiting_parts" | "completed";

export type OrderActivityType =
  | "order_created"
  | "order_scheduled"
  | "mechanic_assigned"
  | "job_added"
  | "part_added"
  | "status_changed"
  | "order_completed";

export interface OrderCustomerSnapshot {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  loyaltyTier: "standard" | "silver" | "gold";
}

export interface OrderVehicleSnapshot {
  id: string;
  vin: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
}

export interface OrderServiceJob {
  id: string;
  name: string;
  category: string;
  status: ServiceJobStatus;
  assignedMechanic: string;
  estimatedHours: number;
  actualHours: number;
  laborPrice: number;
}

export interface OrderPartItem {
  id: string;
  jobId: string;
  jobName: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderActivityItem {
  id: string;
  type: OrderActivityType;
  timestamp: string;
  actor: string;
  description: string;
}

export interface OrderDetails extends OrderListItem {
  customer: OrderCustomerSnapshot;
  vehicle: OrderVehicleSnapshot;
  jobs: OrderServiceJob[];
  parts: OrderPartItem[];
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

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface AssignOrderMechanicPayload {
  assignedMechanic: string;
}

export interface SetOrderFlagPayload {
  flagged: boolean;
}
