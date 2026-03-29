import { delay, http, HttpResponse } from "msw";

import {
  APPOINTMENT_MUTABLE_STATUSES,
  APPOINTMENT_STATUSES,
} from "@/entities/appointment/model/options";
import type { AppointmentStatus, UpdateAppointmentPayload } from "@/entities/appointment/model/types";
import {
  convertAppointmentToOrderState,
  getAppointmentMockState,
  getAppointmentsMockState,
  updateAppointmentState,
} from "@/mocks/state/appointments";
import { paginateItems, parseListQueryParams } from "@/mocks/lib/list";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";

function isInsideDateRange(itemDateIso: string, from: string, to: string) {
  const timestamp = new Date(itemDateIso).getTime();

  if (from) {
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);

    if (timestamp < fromDate.getTime()) {
      return false;
    }
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    if (timestamp > toDate.getTime()) {
      return false;
    }
  }

  return true;
}

function isValidStatus(value: string): value is AppointmentStatus {
  return APPOINTMENT_STATUSES.includes(value as AppointmentStatus);
}

function isValidMutableStatus(value: string): value is NonNullable<UpdateAppointmentPayload["status"]> {
  return APPOINTMENT_MUTABLE_STATUSES.includes(value as NonNullable<UpdateAppointmentPayload["status"]>);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function readJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  const body = (await request.json().catch(() => null)) as unknown;
  return isRecord(body) ? body : null;
}

export const appointmentsHandlers = [
  http.get(toMswPath(apiEndpoints.appointments.list), async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const { page, pageSize, search } = parseListQueryParams(url);
    const status = url.searchParams.get("status");
    const assignedMechanic = url.searchParams.get("assignedMechanic");
    const scheduledFrom = url.searchParams.get("scheduledFrom") ?? "";
    const scheduledTo = url.searchParams.get("scheduledTo") ?? "";
    const sortBy = url.searchParams.get("sortBy") ?? "scheduledFor";
    const sortDirection = url.searchParams.get("sortDirection") === "desc" ? -1 : 1;

    let filtered = getAppointmentsMockState();

    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }

    if (assignedMechanic) {
      filtered = filtered.filter((item) => item.assignedMechanic === assignedMechanic);
    }

    if (scheduledFrom || scheduledTo) {
      filtered = filtered.filter((item) => isInsideDateRange(item.scheduledFor, scheduledFrom, scheduledTo));
    }

    if (search) {
      filtered = filtered.filter((item) => {
        const haystack =
          `${item.number} ${item.customerName} ${item.vehicleLabel} ${item.serviceLabel} ${item.assignedMechanic}`.toLowerCase();
        return haystack.includes(search);
      });
    }

    filtered = filtered.sort((left, right) => {
      const leftTarget = sortBy === "createdAt" ? left.createdAt : left.scheduledFor;
      const rightTarget = sortBy === "createdAt" ? right.createdAt : right.scheduledFor;
      return (new Date(leftTarget).getTime() - new Date(rightTarget).getTime()) * sortDirection;
    });

    return HttpResponse.json(paginateItems(filtered, page, pageSize));
  }),

  http.get(toMswPath(apiEndpoints.appointments.detail(":appointmentId")), async ({ params }) => {
    await delay(220);

    const appointmentId = String(params.appointmentId);
    const appointment = getAppointmentMockState(appointmentId);

    if (!appointment) {
      return HttpResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    return HttpResponse.json(appointment);
  }),

  http.patch(toMswPath(apiEndpoints.appointments.detail(":appointmentId")), async ({ params, request }) => {
    await delay(220);

    const appointmentId = String(params.appointmentId);
    const body = await readJsonBody(request);

    if (!body) {
      return HttpResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const statusValue = typeof body.status === "string" ? body.status : undefined;
    const scheduledFor = typeof body.scheduledFor === "string" ? body.scheduledFor : undefined;
    const assignedMechanic =
      typeof body.assignedMechanic === "string" ? body.assignedMechanic.trim() : undefined;

    if (statusValue && !isValidStatus(statusValue)) {
      return HttpResponse.json({ message: "Invalid appointment status" }, { status: 400 });
    }

    if (scheduledFor && Number.isNaN(new Date(scheduledFor).getTime())) {
      return HttpResponse.json({ message: "Invalid scheduledFor date" }, { status: 400 });
    }

    if (assignedMechanic === "") {
      return HttpResponse.json({ message: "assignedMechanic is required" }, { status: 400 });
    }

    if (!statusValue && !scheduledFor && assignedMechanic === undefined) {
      return HttpResponse.json({ message: "No fields to update" }, { status: 400 });
    }

    const nextStatus = statusValue && isValidMutableStatus(statusValue) ? statusValue : undefined;

    const next = updateAppointmentState(appointmentId, {
      status: nextStatus,
      scheduledFor,
      assignedMechanic,
    });

    if (!next) {
      return HttpResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    return HttpResponse.json(next);
  }),

  http.post(toMswPath(apiEndpoints.appointments.convertToOrder(":appointmentId")), async ({ params }) => {
    await delay(220);

    const appointmentId = String(params.appointmentId);
    const appointment = getAppointmentMockState(appointmentId);

    if (!appointment) {
      return HttpResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    if (appointment.status === "cancelled") {
      return HttpResponse.json({ message: "Cancelled appointment cannot be converted" }, { status: 409 });
    }

    const result = convertAppointmentToOrderState(appointmentId);

    if (!result) {
      return HttpResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    return HttpResponse.json({
      appointmentId,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
    });
  }),
];
