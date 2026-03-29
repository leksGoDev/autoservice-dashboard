import type { AppointmentDetails } from "@/entities/appointment/model/types";

export type MockAppointmentStateItem = AppointmentDetails & {
  archived: boolean;
};
