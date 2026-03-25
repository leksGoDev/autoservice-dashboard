import { delay, http, HttpResponse } from "msw";

import type { VehicleDetails, VehicleListItem, VehicleServiceHistoryItem } from "@/entities/vehicle/model/types";
import { customersFixture } from "@/mocks/fixtures/customers";
import { vehiclesFixture } from "@/mocks/fixtures/vehicles";
import { paginateItems, parseListQueryParams } from "@/mocks/lib/list";
import { getOrdersMockState } from "@/mocks/state/orders";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";

function buildVehiclesRegistry(): VehicleListItem[] {
  const orders = getOrdersMockState();

  return vehiclesFixture.map((vehicle) => {
    const customer = customersFixture.find((item) => item.id === vehicle.customerId);
    const ordersCount = orders.filter((order) => order.vehicleId === vehicle.id).length;

    return {
      ...vehicle,
      owner: customer?.fullName ?? "Unknown owner",
      ordersCount,
    };
  });
}

function findVehicleDetails(vehicleId: string): VehicleDetails | undefined {
  return buildVehiclesRegistry().find((vehicle) => vehicle.id === vehicleId);
}

function buildVehicleServiceHistory(vehicleId: string): VehicleServiceHistoryItem[] {
  return getOrdersMockState()
    .filter((order) => order.vehicleId === vehicleId)
    .map((order) => ({
      orderId: order.id,
      orderNumber: order.number,
      status: order.status,
      totalAmount: order.totalAmount,
      updatedAt: order.updatedAt,
    }))
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
}

export const vehiclesHandlers = [
  http.get(toMswPath(apiEndpoints.vehicles.list), async ({ request }) => {
    await delay(350);

    const url = new URL(request.url);
    const { page, pageSize, search } = parseListQueryParams(url);

    let filtered = buildVehiclesRegistry();

    if (search) {
      filtered = filtered.filter((vehicle) => {
        const haystack = `${vehicle.plateNumber} ${vehicle.vin} ${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.owner}`
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    return HttpResponse.json(paginateItems(filtered, page, pageSize));
  }),
  http.get(toMswPath(apiEndpoints.vehicles.detail(":vehicleId")), async ({ params }) => {
    await delay(250);

    const vehicleId = String(params.vehicleId);
    const vehicle = findVehicleDetails(vehicleId);

    if (!vehicle) {
      return HttpResponse.json({ message: "Vehicle not found" }, { status: 404 });
    }

    return HttpResponse.json(vehicle);
  }),
  http.get(toMswPath(apiEndpoints.vehicles.serviceHistory(":vehicleId")), async ({ params }) => {
    await delay(250);

    const vehicleId = String(params.vehicleId);
    const vehicle = findVehicleDetails(vehicleId);

    if (!vehicle) {
      return HttpResponse.json({ message: "Vehicle not found" }, { status: 404 });
    }

    return HttpResponse.json(buildVehicleServiceHistory(vehicleId));
  }),
];
