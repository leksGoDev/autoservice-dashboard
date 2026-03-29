import type { CustomerDetailsResponse, CustomerListItem } from "@/entities/customer/model/types";
import { getCustomersMockState } from "@/mocks/state/customers";
import { getOrdersMockState } from "@/mocks/state/orders";
import { getVehiclesMockState } from "@/mocks/state/vehicles";

export function buildCustomersRegistry(): CustomerListItem[] {
  const orders = getOrdersMockState();
  const customers = getCustomersMockState();
  const vehicles = getVehiclesMockState();

  return customers.map((customer) => {
    const customerOrders = orders.filter((order) => order.customerId === customer.id);
    const vehiclesCount = vehicles.filter((vehicle) => vehicle.customerId === customer.id).length;

    const lastVisitAt = customerOrders
      .map((order) => new Date(order.updatedAt).getTime())
      .filter((value) => Number.isFinite(value))
      .sort((left, right) => right - left)[0];

    return {
      ...customer,
      vehiclesCount,
      ordersCount: customerOrders.length,
      lastVisitAt: typeof lastVisitAt === "number" ? new Date(lastVisitAt).toISOString() : null,
    };
  });
}

export function buildCustomerDetails(customerId: string): CustomerDetailsResponse | undefined {
  const orders = getOrdersMockState();
  const customer = buildCustomersRegistry().find((item) => item.id === customerId);

  if (!customer) {
    return undefined;
  }

  const vehicles = getVehiclesMockState()
    .filter((vehicle) => vehicle.customerId === customerId)
    .map((vehicle) => ({
      id: vehicle.id,
      vin: vehicle.vin,
      plateNumber: vehicle.plateNumber,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
    }))
    .sort((left, right) => right.year - left.year);

  const customerOrders = orders
    .filter((order) => order.customerId === customerId)
    .map((order) => ({
      id: order.id,
      number: order.number,
      status: order.status,
      vehicleId: order.vehicleId,
      vehicleLabel: order.vehicleLabel,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }))
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());

  return {
    customer,
    vehicles,
    orders: customerOrders,
  };
}
