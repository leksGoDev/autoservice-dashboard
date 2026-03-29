import type { AppointmentListItem } from "@/entities/appointment/model/types";
import { isInsideDateRange } from "@/mocks/lib/date-range";
import { getAppointmentsMockState } from "@/mocks/state/appointments";

type AppointmentsFilterParams = {
  search: string;
  status: string | null;
  assignedMechanic: string | null;
  scheduledFrom: string;
  scheduledTo: string;
  sortBy: string;
  sortDirection: string;
};

export function selectAppointmentsForList({
  search,
  status,
  assignedMechanic,
  scheduledFrom,
  scheduledTo,
  sortBy,
  sortDirection,
}: AppointmentsFilterParams): AppointmentListItem[] {
  let filtered = getAppointmentsMockState();

  if (status) {
    filtered = filtered.filter((item) => item.status === status);
  }

  if (assignedMechanic) {
    filtered = filtered.filter((item) => item.assignedMechanic === assignedMechanic);
  }

  if (scheduledFrom || scheduledTo) {
    filtered = filtered.filter((item) => isInsideDateRange(item.scheduledFor, scheduledFrom, scheduledTo));
  }

  if (search) {
    filtered = filtered.filter((item) => {
      const haystack =
        `${item.number} ${item.customerName} ${item.vehicleLabel} ${item.serviceLabel} ${item.assignedMechanic}`.toLowerCase();
      return haystack.includes(search);
    });
  }

  const direction = sortDirection === "desc" ? -1 : 1;

  return filtered.sort((left, right) => {
    const leftTarget = sortBy === "createdAt" ? left.createdAt : left.scheduledFor;
    const rightTarget = sortBy === "createdAt" ? right.createdAt : right.scheduledFor;
    return (new Date(leftTarget).getTime() - new Date(rightTarget).getTime()) * direction;
  });
}
