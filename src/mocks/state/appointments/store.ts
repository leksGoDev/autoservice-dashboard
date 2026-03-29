import { appointmentsFixture } from "@/mocks/fixtures/appointments";
import type { MockAppointmentStateItem } from "./types";

let appointmentsState = buildInitialAppointmentsState();

function cloneAppointment(item: MockAppointmentStateItem): MockAppointmentStateItem {
  return { ...item };
}

function buildInitialAppointmentsState(): MockAppointmentStateItem[] {
  return appointmentsFixture.map((item) => ({
    ...item,
    archived: false,
  }));
}

export function resetAppointmentsMockState() {
  appointmentsState = buildInitialAppointmentsState();
}

export function findAppointmentIndex(appointmentId: string) {
  return appointmentsState.findIndex((item) => item.id === appointmentId && !item.archived);
}

export function getMutableAppointmentByIndex(index: number) {
  return appointmentsState[index];
}

export function getAppointmentMockState(appointmentId: string): MockAppointmentStateItem | undefined {
  const item = appointmentsState.find((appointment) => appointment.id === appointmentId && !appointment.archived);
  return item ? cloneAppointment(item) : undefined;
}

export function getAppointmentsMockState(): MockAppointmentStateItem[] {
  return appointmentsState.filter((item) => !item.archived).map(cloneAppointment);
}

export function toAppointmentSnapshot(item: MockAppointmentStateItem): MockAppointmentStateItem {
  return cloneAppointment(item);
}
