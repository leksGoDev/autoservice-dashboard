import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type { ListResponse } from "@/shared/api/types";
import type {
  AppointmentDetails,
  AppointmentListItem,
  AppointmentsListParams,
  ConvertAppointmentToOrderResult,
  UpdateAppointmentPayload,
} from "../model/types";

export function getAppointmentsList(params: AppointmentsListParams = {}) {
  return httpRequest<ListResponse<AppointmentListItem>>(apiEndpoints.appointments.list, {
    method: "GET",
    query: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
      status: params.status,
      assignedMechanic: params.assignedMechanic,
      scheduledFrom: params.scheduledFrom,
      scheduledTo: params.scheduledTo,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
    },
  });
}

export function getAppointmentDetails(appointmentId: string) {
  return httpRequest<AppointmentDetails>(apiEndpoints.appointments.detail(appointmentId), {
    method: "GET",
  });
}

export function updateAppointment(appointmentId: string, payload: UpdateAppointmentPayload) {
  return httpRequest<AppointmentDetails>(apiEndpoints.appointments.detail(appointmentId), {
    method: "PATCH",
    body: payload,
  });
}

export function convertAppointmentToOrder(appointmentId: string) {
  return httpRequest<ConvertAppointmentToOrderResult>(apiEndpoints.appointments.convertToOrder(appointmentId), {
    method: "POST",
  });
}
