import { APPOINTMENT_MUTABLE_STATUSES } from "@/entities/appointment/model/options";
import type { AppointmentsToolbarFilters } from "./types";

export const APPOINTMENTS_FILTER_STATUSES = APPOINTMENT_MUTABLE_STATUSES;

export function isAppointmentsFilterStatus(
  value: string,
): value is Exclude<AppointmentsToolbarFilters["status"], ""> {
  return APPOINTMENTS_FILTER_STATUSES.includes(value as Exclude<AppointmentsToolbarFilters["status"], "">);
}
