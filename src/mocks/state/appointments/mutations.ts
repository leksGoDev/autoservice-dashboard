import type { UpdateAppointmentPayload } from "@/entities/appointment/model/types";
import { createOrderFromAppointmentState } from "@/mocks/state/orders";
import {
  findAppointmentIndex,
  getMutableAppointmentByIndex,
  toAppointmentSnapshot,
} from "./store";
import type { MockAppointmentStateItem } from "./types";

export function updateAppointmentState(
  appointmentId: string,
  payload: UpdateAppointmentPayload,
): MockAppointmentStateItem | undefined {
  const index = findAppointmentIndex(appointmentId);

  if (index < 0) {
    return undefined;
  }

  const appointment = getMutableAppointmentByIndex(index);

  if (payload.status) {
    appointment.status = payload.status;
  }

  if (payload.scheduledFor) {
    appointment.scheduledFor = payload.scheduledFor;
  }

  if (payload.assignedMechanic) {
    appointment.assignedMechanic = payload.assignedMechanic;
  }

  return toAppointmentSnapshot(appointment);
}

export function convertAppointmentToOrderState(
  appointmentId: string,
): { appointment: MockAppointmentStateItem; orderId: string; orderNumber: string } | undefined {
  const index = findAppointmentIndex(appointmentId);

  if (index < 0) {
    return undefined;
  }

  const appointment = getMutableAppointmentByIndex(index);
  const order = createOrderFromAppointmentState({
    customerId: appointment.customerId,
    customerName: appointment.customerName,
    vehicleId: appointment.vehicleId,
    vehicleLabel: appointment.vehicleLabel,
    assignedMechanic: appointment.assignedMechanic,
    serviceLabel: appointment.serviceLabel,
    estimatedDurationMin: appointment.estimatedDurationMin,
  });

  appointment.status = "converted";
  appointment.archived = true;

  return {
    appointment: toAppointmentSnapshot(appointment),
    orderId: order.id,
    orderNumber: order.number,
  };
}
