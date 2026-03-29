import { ORDER_STATUSES, SERVICE_JOB_STATUSES } from "@/entities/order/model/options";
import type { OrderStatus, ServiceJobStatus } from "@/entities/order/model/types";

export function isValidOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

export function isValidServiceJobStatus(value: string): value is ServiceJobStatus {
  return SERVICE_JOB_STATUSES.includes(value as ServiceJobStatus);
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && isPositiveNumber(value);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isOrderPriority(value: unknown): value is "low" | "medium" | "high" {
  return value === "low" || value === "medium" || value === "high";
}

export function isInitialJobPayload(
  value: unknown,
): value is {
  name: string;
  category: string;
  estimatedHours: number;
  laborPrice: number;
  assignedMechanic?: string;
} {
  if (!isRecord(value)) {
    return false;
  }

  const name = typeof value.name === "string" ? value.name.trim() : "";
  const category = typeof value.category === "string" ? value.category.trim() : "";
  const estimatedHours = value.estimatedHours;
  const laborPrice = value.laborPrice;
  const assignedMechanic = value.assignedMechanic;

  return (
    Boolean(name) &&
    Boolean(category) &&
    isPositiveNumber(estimatedHours) &&
    isPositiveNumber(laborPrice) &&
    (assignedMechanic === undefined || typeof assignedMechanic === "string")
  );
}

export function isCreateCustomerPayload(
  value: unknown,
): value is {
  fullName: string;
  phone: string;
  email: string;
  loyaltyTier?: "standard" | "silver" | "gold";
} {
  if (!isRecord(value)) {
    return false;
  }

  const fullName = typeof value.fullName === "string" ? value.fullName.trim() : "";
  const phone = typeof value.phone === "string" ? value.phone.trim() : "";
  const email = typeof value.email === "string" ? value.email.trim() : "";
  const loyaltyTier = value.loyaltyTier;

  return (
    Boolean(fullName) &&
    Boolean(phone) &&
    Boolean(email) &&
    (!loyaltyTier || loyaltyTier === "standard" || loyaltyTier === "silver" || loyaltyTier === "gold")
  );
}

export function isCreateVehiclePayload(
  value: unknown,
): value is {
  vin: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
} {
  if (!isRecord(value)) {
    return false;
  }

  const vin = typeof value.vin === "string" ? value.vin.trim() : "";
  const plateNumber = typeof value.plateNumber === "string" ? value.plateNumber.trim() : "";
  const make = typeof value.make === "string" ? value.make.trim() : "";
  const model = typeof value.model === "string" ? value.model.trim() : "";
  const year = typeof value.year === "number" ? value.year : Number.NaN;

  return (
    Boolean(vin) &&
    Boolean(plateNumber) &&
    Boolean(make) &&
    Boolean(model) &&
    Number.isInteger(year) &&
    year >= 1980 &&
    year <= 2100
  );
}

export async function readJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  const body = (await request.json().catch(() => null)) as unknown;
  return isRecord(body) ? body : null;
}
