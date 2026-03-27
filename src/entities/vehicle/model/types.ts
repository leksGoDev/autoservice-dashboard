export interface Vehicle {
  id: string;
  customerId: string;
  vin: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
}

export interface CreateVehiclePayload {
  customerId: string;
  vin: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
}

export interface VehicleListItem extends Vehicle {
  owner: string;
  ordersCount: number;
}

export interface VehiclesListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface VehicleDetails extends VehicleListItem {}

export interface VehicleServiceHistoryItem {
  orderId: string;
  orderNumber: string;
  status: "scheduled" | "in_progress" | "waiting_parts" | "completed" | "cancelled";
  totalAmount: number;
  updatedAt: string;
}
