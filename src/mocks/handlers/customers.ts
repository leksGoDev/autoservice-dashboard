import { delay, http, HttpResponse } from "msw";

import type { CustomerDetailsResponse, CustomerListItem } from "@/entities/customer/model/types";
import { customersFixture } from "@/mocks/fixtures/customers";
import { ordersFixture } from "@/mocks/fixtures/orders";
import { vehiclesFixture } from "@/mocks/fixtures/vehicles";
import { DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from "@/shared/api/constants";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";

function buildCustomersRegistry(): CustomerListItem[] {
  return customersFixture.map((customer) => {
    const customerOrders = ordersFixture.filter((order) => order.customerId === customer.id);
    const vehiclesCount = vehiclesFixture.filter((vehicle) => vehicle.customerId === customer.id).length;

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
  const customer = buildCustomersRegistry().find((item) => item.id === customerId);

  if (!customer) {
    return undefined;
  }

  const vehicles = vehiclesFixture
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

  const orders = ordersFixture
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
    orders,
  };
}

export const customersHandlers = [
  http.get(toMswPath(apiEndpoints.customers.list), async ({ request }) => {
    await delay(350);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? String(DEFAULT_LIST_PAGE));
    const pageSize = Number(url.searchParams.get("pageSize") ?? String(DEFAULT_LIST_PAGE_SIZE));
    const search = (url.searchParams.get("search") ?? "").toLowerCase().trim();

    let filtered = buildCustomersRegistry();

    if (search) {
      filtered = filtered.filter((customer) => {
        const haystack = `${customer.fullName} ${customer.phone} ${customer.email}`.toLowerCase();
        return haystack.includes(search);
      });
    }

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));
    const start = (safePage - 1) * safePageSize;
    const items = filtered.slice(start, start + safePageSize);

    return HttpResponse.json({
      items,
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages,
    });
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
];
