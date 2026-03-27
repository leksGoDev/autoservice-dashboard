import type { OrderPriority, OrderStatus } from "@/entities/order/model/types";

export type CreateOrderCustomerInput =
  | {
      mode: "existing";
      customerId: string;
    }
  | {
      mode: "new";
      fullName: string;
      phone: string;
      email: string;
      loyaltyTier: "standard" | "silver" | "gold";
    };

export type CreateOrderVehicleInput =
  | {
      mode: "existing";
      vehicleId: string;
    }
  | {
      mode: "new";
      vin: string;
      plateNumber: string;
      make: string;
      model: string;
      year: number;
    };

export type CreateOrderFlowInput = {
  customer: CreateOrderCustomerInput;
  vehicle: CreateOrderVehicleInput;
  scheduledFor: string;
  complaint: string;
  notes: string;
  priority: OrderPriority;
  status: OrderStatus;
  assignedMechanic: string;
  initialJobs: Array<{
    name: string;
    category: string;
    estimatedHours: number;
    laborPrice: number;
    assignedMechanic?: string;
  }>;
};
