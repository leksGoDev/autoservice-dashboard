export interface Vehicle {
  id: string;
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
