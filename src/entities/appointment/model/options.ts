import type { AppointmentStatus } from "./types";

export const APPOINTMENT_STATUSES: AppointmentStatus[] = ["pending", "confirmed", "cancelled", "converted"];

export const APPOINTMENT_MUTABLE_STATUSES: Exclude<AppointmentStatus, "converted">[] = [
  "pending",
  "confirmed",
  "cancelled",
];
