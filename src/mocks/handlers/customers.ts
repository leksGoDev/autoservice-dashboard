import { delay, http, HttpResponse } from "msw";

import type { CustomerDetailsResponse, CustomerListItem } from "@/entities/customer/model/types";
import { paginateItems, parseListQueryParams } from "@/mocks/lib/list";
import { createCustomerState, getCustomersMockState } from "@/mocks/state/customers";
import { getOrdersMockState } from "@/mocks/state/orders";
import { getVehiclesMockState } from "@/mocks/state/vehicles";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";

function buildCustomersRegistry(): CustomerListItem[] {
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

function buildCustomerDetails(customerId: string): CustomerDetailsResponse | undefined {
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

export const customersHandlers = [
  http.get(toMswPath(apiEndpoints.customers.list), async ({ request }) => {
    await delay(350);

    const url = new URL(request.url);
    const { page, pageSize, search } = parseListQueryParams(url);

    let filtered = buildCustomersRegistry();

    if (search) {
      filtered = filtered.filter((customer) => {
        const haystack = `${customer.fullName} ${customer.phone} ${customer.email}`.toLowerCase();
        return haystack.includes(search);
      });
    }

    return HttpResponse.json(paginateItems(filtered, page, pageSize));
  }),
  http.get(toMswPath(apiEndpoints.customers.detail(":customerId")), async ({ params }) => {
    await delay(250);

    const customerId = String(params.customerId);
    const details = buildCustomerDetails(customerId);

    if (!details) {
      return HttpResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return HttpResponse.json(details);
  }),
  http.post(toMswPath(apiEndpoints.customers.list), async ({ request }) => {
    await delay(250);

    const body = (await request.json().catch(() => null)) as Partial<{
      fullName: string;
      phone: string;
      email: string;
      loyaltyTier: "standard" | "silver" | "gold";
    }> | null;

    const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const loyaltyTier = body?.loyaltyTier ?? "standard";

    if (!fullName || !phone || !email) {
      return HttpResponse.json({ message: "Invalid customer payload" }, { status: 400 });
    }

    if (!["standard", "silver", "gold"].includes(loyaltyTier)) {
      return HttpResponse.json({ message: "Invalid customer payload" }, { status: 400 });
    }

    const created = createCustomerState({
      fullName,
      phone,
      email,
      loyaltyTier,
    });

    return HttpResponse.json(
      {
        ...created,
        vehiclesCount: 0,
        ordersCount: 0,
        lastVisitAt: null,
      },
      { status: 201 },
    );
  }),
];
