import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  convertAppointmentToOrder,
  updateAppointment,
} from "@/entities/appointment/api/requests";
import { queryKeys } from "@/shared/api/query-keys";

type AppointmentVariables = {
  appointmentId: string;
};

type RescheduleAppointmentVariables = AppointmentVariables & {
  scheduledFor: string;
  assignedMechanic: string;
};

function invalidateRelatedQueries(queryClient: ReturnType<typeof useQueryClient>, appointmentId: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.appointments.root });
  queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(appointmentId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.orders.root });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
  queryClient.invalidateQueries({ queryKey: queryKeys.workBoard.root });
  queryClient.invalidateQueries({ queryKey: queryKeys.customers.root });
  queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.root });
}

export function useConfirmAppointmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId }: AppointmentVariables) =>
      updateAppointment(appointmentId, {
        status: "confirmed",
      }),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.appointmentId);
    },
  });
}

export function useRescheduleAppointmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, scheduledFor, assignedMechanic }: RescheduleAppointmentVariables) =>
      updateAppointment(appointmentId, {
        scheduledFor,
        assignedMechanic,
      }),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.appointmentId);
    },
  });
}

export function useCancelAppointmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId }: AppointmentVariables) =>
      updateAppointment(appointmentId, {
        status: "cancelled",
      }),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.appointmentId);
    },
  });
}

export function useConvertAppointmentToOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId }: AppointmentVariables) => convertAppointmentToOrder(appointmentId),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.appointmentId);
    },
  });
}
