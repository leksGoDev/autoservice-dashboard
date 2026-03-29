import { delay, http, HttpResponse } from "msw";

import {
  convertAppointmentToOrderState,
  getAppointmentMockState,
  updateAppointmentState,
} from "@/mocks/state/appointments";
import { paginateItems, parseListQueryParams } from "@/mocks/lib/list";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";
import { selectAppointmentsForList } from "./builders";
import { isValidMutableAppointmentStatus, readJsonBody } from "./validators";

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
    const sortDirection = url.searchParams.get("sortDirection") === "desc" ? "desc" : "asc";

    const filtered = selectAppointmentsForList({
      search,
      status,
      assignedMechanic,
      scheduledFrom,
      scheduledTo,
      sortBy,
      sortDirection,
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

    if (statusValue && !isValidMutableAppointmentStatus(statusValue)) {
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

    const nextStatus = statusValue && isValidMutableAppointmentStatus(statusValue) ? statusValue : undefined;

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
