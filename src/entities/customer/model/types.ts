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
