import type { SortDirection } from "@/shared/api/types";

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "converted";

export interface AppointmentListItem {
  id: string;
  number: string;
  status: AppointmentStatus;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleLabel: string;
  assignedMechanic: string;
  serviceLabel: string;
  scheduledFor: string;
  createdAt: string;
}

export interface AppointmentDetails extends AppointmentListItem {
  notes: string;
  estimatedDurationMin: number;
  contactPhone: string;
}

export interface AppointmentsListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: AppointmentStatus;
  assignedMechanic?: string;
  scheduledFrom?: string;
  scheduledTo?: string;
  sortBy?: "scheduledFor" | "createdAt";
  sortDirection?: SortDirection;
}

export interface UpdateAppointmentPayload {
  status?: Exclude<AppointmentStatus, "converted">;
  scheduledFor?: string;
  assignedMechanic?: string;
}

export interface ConvertAppointmentToOrderResult {
  appointmentId: string;
  orderId: string;
  orderNumber: string;
}
