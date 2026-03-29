import { APPOINTMENT_MUTABLE_STATUSES } from "@/entities/appointment/model/options";
import type { UpdateAppointmentPayload } from "@/entities/appointment/model/types";

export function isValidMutableAppointmentStatus(
  value: string,
): value is NonNullable<UpdateAppointmentPayload["status"]> {
  return APPOINTMENT_MUTABLE_STATUSES.includes(value as NonNullable<UpdateAppointmentPayload["status"]>);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function readJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  const body = (await request.json().catch(() => null)) as unknown;
  return isRecord(body) ? body : null;
}
