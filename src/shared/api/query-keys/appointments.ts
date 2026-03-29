import { DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from "../constants";
import type { AppointmentsListParamsKey } from "./types";

function normalizeAppointmentsParams(params: AppointmentsListParamsKey = {}) {
  return {
    page: params.page ?? DEFAULT_LIST_PAGE,
    pageSize: params.pageSize ?? DEFAULT_LIST_PAGE_SIZE,
    search: params.search ?? "",
    sortBy: params.sortBy ?? "scheduledFor",
    sortDirection: params.sortDirection ?? "asc",
    status: params.status ?? "",
    assignedMechanic: params.assignedMechanic ?? "",
    scheduledFrom: params.scheduledFrom ?? "",
    scheduledTo: params.scheduledTo ?? "",
  };
}

export const appointmentsQueryKeys = {
  root: ["appointments"] as const,
  list: (params: AppointmentsListParamsKey = {}) =>
    ["appointments", "list", normalizeAppointmentsParams(params)] as const,
  detail: (appointmentId: string) => ["appointments", "detail", appointmentId] as const,
} as const;
