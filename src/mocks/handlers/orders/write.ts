import { delay, http, HttpResponse } from "msw";
import { ORDER_STATUSES, SERVICE_JOB_STATUSES } from "@/entities/order/model/options";
import type { OrderStatus, ServiceJobStatus } from "@/entities/order/model/types";

import {
  addJobPartState,
  addServiceJobState,
  assignOrderMechanicState,
  assignServiceJobMechanicState,
  createOrderState,
  removeJobPartState,
  setOrderFlagState,
  updateJobPartQuantityState,
  updateOrderStatusState,
  updateServiceJobStatusState,
} from "@/mocks/state/orders";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";
import { buildOrderDetails } from "./shared";

function isValidStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

function isValidServiceJobStatus(value: string): value is ServiceJobStatus {
  return SERVICE_JOB_STATUSES.includes(value as ServiceJobStatus);
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && isPositiveNumber(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOrderPriority(value: unknown): value is "low" | "medium" | "high" {
  return value === "low" || value === "medium" || value === "high";
}

function isInitialJobPayload(value: unknown): value is {
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

function isCreateCustomerPayload(
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

function isCreateVehiclePayload(
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

async function readJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  const body = (await request.json().catch(() => null)) as unknown;
  return isRecord(body) ? body : null;
}

export const ordersWriteHandlers = [
  http.post(toMswPath(apiEndpoints.orders.list), async ({ request }) => {
    await delay(250);

    const body = await readJsonBody(request);
    const customerId = typeof body?.customerId === "string" ? body.customerId : undefined;
    const customer = body?.customer;
    const vehicleId = typeof body?.vehicleId === "string" ? body.vehicleId : undefined;
    const vehicle = body?.vehicle;
    const scheduledFor = typeof body?.scheduledFor === "string" ? body.scheduledFor : "";
    const complaint = typeof body?.complaint === "string" ? body.complaint.trim() : "";
    const notes = typeof body?.notes === "string" ? body.notes.trim() : "";
    const status = typeof body?.status === "string" ? body.status : "";
    const priority = body?.priority;
    const assignedMechanic = typeof body?.assignedMechanic === "string" ? body.assignedMechanic.trim() : "";
    const initialJobs = Array.isArray(body?.initialJobs) ? body.initialJobs : [];
    const hasCustomerReference = Boolean(customerId) || isCreateCustomerPayload(customer);
    const hasVehicleReference = Boolean(vehicleId) || isCreateVehiclePayload(vehicle);

    if (
      !hasCustomerReference ||
      !hasVehicleReference ||
      !scheduledFor ||
      Number.isNaN(new Date(scheduledFor).getTime()) ||
      !complaint ||
      !assignedMechanic ||
      !isValidStatus(status) ||
      !isOrderPriority(priority) ||
      initialJobs.length === 0 ||
      !initialJobs.every((job) => isInitialJobPayload(job))
    ) {
      return HttpResponse.json({ message: "Invalid create order payload" }, { status: 400 });
    }

    const nextOrder = createOrderState({
      customerId,
      customer: !customerId && isCreateCustomerPayload(customer) ? customer : undefined,
      vehicleId,
      vehicle: !vehicleId && isCreateVehiclePayload(vehicle) ? vehicle : undefined,
      scheduledFor,
      complaint,
      notes,
      priority,
      status,
      assignedMechanic,
      initialJobs: initialJobs.map((job) => ({
        name: job.name.trim(),
        category: job.category.trim(),
        estimatedHours: job.estimatedHours,
        laborPrice: job.laborPrice,
        assignedMechanic: typeof job.assignedMechanic === "string" ? job.assignedMechanic.trim() : undefined,
      })),
    });

    if (!nextOrder) {
      return HttpResponse.json({ message: "Customer or vehicle not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder), { status: 201 });
  }),
  http.patch(toMswPath(apiEndpoints.orders.status(":orderId")), async ({ params, request }) => {
    await delay(250);

    const orderId = String(params.orderId);
    const body = await readJsonBody(request);
    const status = typeof body?.status === "string" ? body.status : undefined;

    if (!status || !isValidStatus(status)) {
      return HttpResponse.json({ message: "Invalid order status" }, { status: 400 });
    }

    const nextOrder = updateOrderStatusState(orderId, status);

    if (!nextOrder) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder));
  }),
  http.patch(toMswPath(apiEndpoints.orders.detail(":orderId")), async ({ params, request }) => {
    await delay(250);

    const orderId = String(params.orderId);
    const body = await readJsonBody(request);
    const assignedMechanic = typeof body?.assignedMechanic === "string" ? body.assignedMechanic.trim() : "";

    if (!assignedMechanic) {
      return HttpResponse.json({ message: "assignedMechanic is required" }, { status: 400 });
    }

    const nextOrder = assignOrderMechanicState(orderId, assignedMechanic);

    if (!nextOrder) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder));
  }),
  http.patch(toMswPath(apiEndpoints.orders.flag(":orderId")), async ({ params, request }) => {
    await delay(250);

    const orderId = String(params.orderId);
    const body = await readJsonBody(request);

    if (typeof body?.flagged !== "boolean") {
      return HttpResponse.json({ message: "flagged must be boolean" }, { status: 400 });
    }

    const nextOrder = setOrderFlagState(orderId, body.flagged);

    if (!nextOrder) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder));
  }),
  http.post(toMswPath(apiEndpoints.orders.jobs(":orderId")), async ({ params, request }) => {
    await delay(250);

    const orderId = String(params.orderId);
    const body = await readJsonBody(request);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const category = typeof body?.category === "string" ? body.category.trim() : "";
    const assignedMechanic = typeof body?.assignedMechanic === "string" ? body.assignedMechanic.trim() : "";
    const estimatedHours = body?.estimatedHours;
    const laborPrice = body?.laborPrice;

    if (!name || !category || !isPositiveNumber(estimatedHours) || !isPositiveNumber(laborPrice)) {
      return HttpResponse.json({ message: "Invalid service job payload" }, { status: 400 });
    }

    const nextOrder = addServiceJobState(orderId, {
      name,
      category,
      estimatedHours,
      laborPrice,
      assignedMechanic: assignedMechanic || undefined,
    });

    if (!nextOrder) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder), { status: 201 });
  }),
  http.patch(toMswPath(apiEndpoints.jobs.status(":jobId")), async ({ params, request }) => {
    await delay(250);

    const jobId = String(params.jobId);
    const body = await readJsonBody(request);
    const status = typeof body?.status === "string" ? body.status : undefined;

    if (!status || !isValidServiceJobStatus(status)) {
      return HttpResponse.json({ message: "Invalid service job status" }, { status: 400 });
    }

    const nextOrder = updateServiceJobStatusState(jobId, status);

    if (!nextOrder) {
      return HttpResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder));
  }),
  http.patch(toMswPath(apiEndpoints.jobs.assignMechanic(":jobId")), async ({ params, request }) => {
    await delay(250);

    const jobId = String(params.jobId);
    const body = await readJsonBody(request);
    const assignedMechanic = typeof body?.assignedMechanic === "string" ? body.assignedMechanic.trim() : "";

    if (!assignedMechanic) {
      return HttpResponse.json({ message: "assignedMechanic is required" }, { status: 400 });
    }

    const nextOrder = assignServiceJobMechanicState(jobId, assignedMechanic);

    if (!nextOrder) {
      return HttpResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder));
  }),
  http.post(toMswPath(apiEndpoints.jobs.parts(":jobId")), async ({ params, request }) => {
    await delay(250);

    const jobId = String(params.jobId);
    const body = await readJsonBody(request);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const quantity = body?.quantity;
    const unitPrice = body?.unitPrice;

    if (!name || !isPositiveInteger(quantity) || !isPositiveNumber(unitPrice)) {
      return HttpResponse.json({ message: "Invalid job part payload" }, { status: 400 });
    }

    const nextOrder = addJobPartState(jobId, {
      name,
      quantity,
      unitPrice,
    });

    if (!nextOrder) {
      return HttpResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder), { status: 201 });
  }),
  http.patch(toMswPath(apiEndpoints.jobParts.detail(":jobPartId")), async ({ params, request }) => {
    await delay(250);

    const jobPartId = String(params.jobPartId);
    const body = await readJsonBody(request);
    const quantity = body?.quantity;

    if (!isPositiveInteger(quantity)) {
      return HttpResponse.json({ message: "quantity must be a positive integer" }, { status: 400 });
    }

    const nextOrder = updateJobPartQuantityState(jobPartId, quantity);

    if (!nextOrder) {
      return HttpResponse.json({ message: "Part not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder));
  }),
  http.delete(toMswPath(apiEndpoints.jobParts.detail(":jobPartId")), async ({ params }) => {
    await delay(250);

    const jobPartId = String(params.jobPartId);
    const nextOrder = removeJobPartState(jobPartId);

    if (!nextOrder) {
      return HttpResponse.json({ message: "Part not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder));
  }),
];
