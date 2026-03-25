import { delay, http, HttpResponse } from "msw";
import { ORDER_STATUSES, SERVICE_JOB_STATUSES } from "@/entities/order/model/options";
import type { OrderStatus, ServiceJobStatus } from "@/entities/order/model/types";

import {
  addJobPartState,
  addServiceJobState,
  assignOrderMechanicState,
  assignServiceJobMechanicState,
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

async function readJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  const body = (await request.json().catch(() => null)) as unknown;
  return isRecord(body) ? body : null;
}

export const ordersWriteHandlers = [
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
