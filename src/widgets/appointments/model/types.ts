import type { AppointmentListItem, AppointmentStatus } from "@/entities/appointment/model/types";

export type AppointmentsToolbarFilters = {
  search: string;
  status: "" | Exclude<AppointmentStatus, "converted">;
  mechanic: string;
  scheduledFrom: string;
  scheduledTo: string;
};

export type AppointmentGroupKey = "today" | "upcoming" | "overdue";

export type AppointmentsGroup = {
  key: AppointmentGroupKey;
  items: AppointmentListItem[];
};
