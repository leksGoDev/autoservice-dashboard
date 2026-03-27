import type {
  OrderDetails,
  OrderListItem,
} from "@/entities/order/model/types";
import { getCustomerMockState } from "@/mocks/state/customers";
import type { MockOrderStateItem } from "@/mocks/state/orders";
import { getVehicleMockState } from "@/mocks/state/vehicles";

export function toOrderListItem(item: MockOrderStateItem): OrderListItem {
  return {
    id: item.id,
    number: item.number,
    status: item.status,
    priority: item.priority,
    flagged: item.flagged,
    customerId: item.customerId,
    customerName: item.customerName,
    vehicleId: item.vehicleId,
    vehicleLabel: item.vehicleLabel,
    assignedMechanic: item.assignedMechanic,
    jobsCount: item.jobsCount,
    totalAmount: item.totalAmount,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export function buildOrderDetails(orderState: MockOrderStateItem): OrderDetails {
  const order = toOrderListItem(orderState);
  const customer = getCustomerMockState(order.customerId);
  const vehicle = getVehicleMockState(order.vehicleId);

  return {
    ...order,
    scheduledFor: orderState.scheduledFor ?? null,
    complaint: orderState.complaint ?? "",
    notes: orderState.notes ?? "",
    customer: {
      id: customer?.id ?? order.customerId,
      fullName: customer?.fullName ?? order.customerName,
      phone: customer?.phone ?? "Unknown",
      email: customer?.email ?? "Unknown",
      loyaltyTier: customer?.loyaltyTier ?? "standard",
    },
    vehicle: {
      id: vehicle?.id ?? order.vehicleId,
      vin: vehicle?.vin ?? "Unknown",
      plateNumber: vehicle?.plateNumber ?? "Unknown",
      make: vehicle?.make ?? "Unknown",
      model: vehicle?.model ?? "Unknown",
      year: vehicle?.year ?? 0,
    },
    jobs: orderState.jobs,
    parts: orderState.parts,
  };
}
