export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  loyaltyTier: "standard" | "silver" | "gold";
}

export interface CustomerListItem extends Customer {
  vehiclesCount: number;
  ordersCount: number;
  lastVisitAt: string | null;
}

export interface CustomersListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CustomerVehicleListItem {
  id: string;
  vin: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
}

export type CustomerOrderHistoryStatus =
  | "scheduled"
  | "in_progress"
  | "waiting_parts"
  | "completed"
  | "cancelled";

export interface CustomerOrderHistoryItem {
  id: string;
  number: string;
  status: CustomerOrderHistoryStatus;
  vehicleId: string;
  vehicleLabel: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDetailsResponse {
  customer: CustomerListItem;
  vehicles: CustomerVehicleListItem[];
  orders: CustomerOrderHistoryItem[];
}
