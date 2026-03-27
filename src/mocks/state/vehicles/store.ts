import type { CreateVehiclePayload, Vehicle } from "@/entities/vehicle/model/types";
import { vehiclesFixture } from "@/mocks/fixtures/vehicles";

let vehiclesState: Vehicle[] = vehiclesFixture.map((vehicle) => ({ ...vehicle }));

function getNextVehicleSequence() {
  const maxSequence = vehiclesState.reduce((max, vehicle) => {
    const sequence = Number(vehicle.id.replace(/\D/g, ""));
    return Number.isFinite(sequence) ? Math.max(max, sequence) : max;
  }, 0);

  return maxSequence + 1;
}

function buildVehicleId(sequence: number) {
  return `veh_${String(sequence).padStart(3, "0")}`;
}

function toVehicleSnapshot(vehicle: Vehicle): Vehicle {
  return { ...vehicle };
}

export function getVehiclesMockState() {
  return vehiclesState.map(toVehicleSnapshot);
}

export function getVehicleMockState(vehicleId: string) {
  const vehicle = vehiclesState.find((item) => item.id === vehicleId);
  return vehicle ? toVehicleSnapshot(vehicle) : undefined;
}

export function createVehicleState(payload: CreateVehiclePayload): Vehicle {
  const nextVehicle: Vehicle = {
    id: buildVehicleId(getNextVehicleSequence()),
    customerId: payload.customerId,
    vin: payload.vin,
    plateNumber: payload.plateNumber,
    make: payload.make,
    model: payload.model,
    year: payload.year,
  };

  vehiclesState.push(nextVehicle);
  return toVehicleSnapshot(nextVehicle);
}

export function resetVehiclesMockState() {
  vehiclesState = vehiclesFixture.map((vehicle) => ({ ...vehicle }));
}
