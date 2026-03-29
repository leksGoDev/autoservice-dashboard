import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/query-keys";
import type { AppointmentsListParams } from "../model/types";
import { getAppointmentDetails, getAppointmentsList } from "./requests";

export function useAppointmentsListQuery(params: AppointmentsListParams = {}) {
  return useQuery({
    queryKey: queryKeys.appointments.list(params),
    queryFn: () => getAppointmentsList(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useAppointmentDetailsQuery(appointmentId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.appointments.detail(appointmentId ?? ""),
    queryFn: () => getAppointmentDetails(appointmentId ?? ""),
    enabled: Boolean(appointmentId),
  });
}
