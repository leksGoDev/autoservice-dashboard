import { delay, http, HttpResponse } from "msw";

import type { VehicleListItem } from "@/entities/vehicle/model/types";
import { customersFixture } from "@/mocks/fixtures/customers";
import { ordersFixture } from "@/mocks/fixtures/orders";
import { vehiclesFixture } from "@/mocks/fixtures/vehicles";
import { DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from "@/shared/api/constants";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";

function buildVehiclesRegistry(): VehicleListItem[] {
  return vehiclesFixture.map((vehicle) => {
    const customer = customersFixture.find((item) => item.id === vehicle.customerId);
    const ordersCount = ordersFixture.filter((order) => order.vehicleId === vehicle.id).length;

    return {
      ...vehicle,
      owner: customer?.fullName ?? "Unknown owner",
      ordersCount,
    };
  });
}

export const vehiclesHandlers = [
  http.get(toMswPath(apiEndpoints.vehicles.list), async ({ request }) => {
    await delay(350);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? String(DEFAULT_LIST_PAGE));
    const pageSize = Number(url.searchParams.get("pageSize") ?? String(DEFAULT_LIST_PAGE_SIZE));
    const search = (url.searchParams.get("search") ?? "").toLowerCase().trim();

    let filtered = buildVehiclesRegistry();

    if (search) {
      filtered = filtered.filter((vehicle) => {
        const haystack = `${vehicle.plateNumber} ${vehicle.vin} ${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.owner}`
          .toLowerCase();
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
];
