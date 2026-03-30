import { delay, http, HttpResponse } from "msw";

import { getCustomersMockState } from "@/mocks/state/customers";
import { getOrdersMockState } from "@/mocks/state/orders";
import { getVehiclesMockState } from "@/mocks/state/vehicles";
import { DEFAULT_GLOBAL_SEARCH_LIMIT } from "@/shared/api/constants";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";
import type { GlobalSearchResult } from "@/entities/search/model/types";

function parseSearchLimit(rawLimit: string | null) {
  if (!rawLimit) {
    return DEFAULT_GLOBAL_SEARCH_LIMIT;
  }

  const parsed = Number(rawLimit);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

function buildOrderSearchResults(query: string): GlobalSearchResult[] {
  return getOrdersMockState()
    .filter((order) => {
      const haystack = `${order.number} ${order.customerName} ${order.vehicleLabel} ${order.assignedMechanic}`.toLowerCase();
      return haystack.includes(query);
    })
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .map((order) => ({
      id: `order:${order.id}`,
      entityType: "order",
      entityId: order.id,
      title: order.number,
      subtitle: `${order.customerName} • ${order.vehicleLabel}`,
      meta: order.assignedMechanic,
    }));
}

function buildCustomerSearchResults(query: string): GlobalSearchResult[] {
  return getCustomersMockState()
    .filter((customer) => {
      const haystack = `${customer.fullName} ${customer.phone} ${customer.email}`.toLowerCase();
      return haystack.includes(query);
    })
    .sort((left, right) => left.fullName.localeCompare(right.fullName))
    .map((customer) => ({
      id: `customer:${customer.id}`,
      entityType: "customer",
      entityId: customer.id,
      title: customer.fullName,
      subtitle: customer.phone,
      meta: customer.email,
    }));
}

function buildVehicleSearchResults(query: string): GlobalSearchResult[] {
  const customers = getCustomersMockState();

  return getVehiclesMockState()
    .map((vehicle) => {
      const owner = customers.find((customer) => customer.id === vehicle.customerId)?.fullName ?? "Unknown owner";

      return {
        vehicle,
        owner,
      };
    })
    .filter(({ vehicle, owner }) => {
      const haystack = `${vehicle.plateNumber} ${vehicle.vin} ${vehicle.make} ${vehicle.model} ${vehicle.year} ${owner}`.toLowerCase();
      return haystack.includes(query);
    })
    .sort((left, right) => right.vehicle.year - left.vehicle.year)
    .map(({ vehicle, owner }) => ({
      id: `vehicle:${vehicle.id}`,
      entityType: "vehicle",
      entityId: vehicle.id,
      title: `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
      subtitle: `${vehicle.plateNumber} • ${vehicle.vin}`,
      meta: owner,
    }));
}

export const searchHandlers = [
  http.get(toMswPath(apiEndpoints.search.global), async ({ request }) => {
    await delay(250);

    const url = new URL(request.url);
    const query = (url.searchParams.get("query") ?? "").trim().toLowerCase();
    const limit = parseSearchLimit(url.searchParams.get("limit"));

    if (!query) {
      return HttpResponse.json({ items: [] });
    }

    const items = [
      ...buildOrderSearchResults(query),
      ...buildCustomerSearchResults(query),
      ...buildVehicleSearchResults(query),
    ].slice(0, limit);

    return HttpResponse.json({ items });
  }),
];
