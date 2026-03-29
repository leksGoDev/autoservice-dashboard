import { delay, http, HttpResponse } from "msw";

import type { VehicleDetails, VehicleListItem, VehicleServiceHistoryItem } from "@/entities/vehicle/model/types";
import { paginateItems, parseListQueryParams } from "@/mocks/lib/list";
import { getCustomersMockState } from "@/mocks/state/customers";
import { getOrdersMockState } from "@/mocks/state/orders";
import { createVehicleState, getVehiclesMockState } from "@/mocks/state/vehicles";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";

function buildVehiclesRegistry(): VehicleListItem[] {
  const orders = getOrdersMockState();
  const customers = getCustomersMockState();
  const vehicles = getVehiclesMockState();

  return vehicles.map((vehicle) => {
    const customer = customers.find((item) => item.id === vehicle.customerId);
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
  http.post(toMswPath(apiEndpoints.vehicles.list), async ({ request }) => {
    await delay(250);

    const body = (await request.json().catch(() => null)) as Partial<{
      customerId: string;
      vin: string;
      plateNumber: string;
      make: string;
      model: string;
      year: number;
    }> | null;

    const customerId = typeof body?.customerId === "string" ? body.customerId : "";
    const vin = typeof body?.vin === "string" ? body.vin.trim() : "";
    const plateNumber = typeof body?.plateNumber === "string" ? body.plateNumber.trim() : "";
    const make = typeof body?.make === "string" ? body.make.trim() : "";
    const model = typeof body?.model === "string" ? body.model.trim() : "";
    const year = typeof body?.year === "number" ? body.year : NaN;

    if (!customerId || !vin || !plateNumber || !make || !model || !Number.isInteger(year)) {
      return HttpResponse.json({ message: "Invalid vehicle payload" }, { status: 400 });
    }

    const owner = getCustomersMockState().find((customer) => customer.id === customerId);

    if (!owner) {
      return HttpResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    const created = createVehicleState({
      customerId,
      vin,
      plateNumber,
      make,
      model,
      year,
    });

    return HttpResponse.json(
      {
        ...created,
        owner: owner.fullName,
        ordersCount: 0,
      },
      { status: 201 },
    );
  }),
];
