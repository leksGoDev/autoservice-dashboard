import { useEffect, useMemo, useState } from "react";

import type { AppointmentStatus } from "@/entities/appointment/model/types";
import {
  useCancelAppointmentMutation,
  useConfirmAppointmentMutation,
  useConvertAppointmentToOrderMutation,
  useRescheduleAppointmentMutation,
} from "@/features/appointment-operations/api/mutations";
import { isApiError } from "@/shared/api/api-error";
import { useI18n } from "@/shared/i18n/use-i18n";

type LastSuccessKey = "confirm" | "reschedule" | "cancel" | "convert";

type UseAppointmentOperationsModelParams = {
  appointmentId: string;
  status: AppointmentStatus;
  scheduledFor: string;
  assignedMechanic: string;
  mechanics: string[];
};

function toDateTimeLocalValue(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

function fromDateTimeLocalValue(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function getErrorMessage(error: unknown, fallback: string) {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export const useAppointmentOperationsModel = ({
  appointmentId,
  status,
  scheduledFor,
  assignedMechanic,
  mechanics,
}: UseAppointmentOperationsModelParams) => {
  const { t } = useI18n();

  const [nextScheduledFor, setNextScheduledFor] = useState(toDateTimeLocalValue(scheduledFor));
  const [nextMechanic, setNextMechanic] = useState(assignedMechanic);
  const [lastSuccessKey, setLastSuccessKey] = useState<LastSuccessKey | null>(null);

  const confirmMutation = useConfirmAppointmentMutation();
  const rescheduleMutation = useRescheduleAppointmentMutation();
  const cancelMutation = useCancelAppointmentMutation();
  const convertMutation = useConvertAppointmentToOrderMutation();

  useEffect(() => {
    setNextScheduledFor(toDateTimeLocalValue(scheduledFor));
  }, [scheduledFor]);

  useEffect(() => {
    setNextMechanic(assignedMechanic);
  }, [assignedMechanic]);

  const availableMechanics = useMemo(() => {
    const unique = new Set(mechanics.filter((item) => item.trim().length > 0));

    if (assignedMechanic.trim().length > 0) {
      unique.add(assignedMechanic);
    }

    return [...unique].sort((left, right) => left.localeCompare(right));
  }, [assignedMechanic, mechanics]);

  const resetFeedback = () => {
    setLastSuccessKey(null);
    confirmMutation.reset();
    rescheduleMutation.reset();
    cancelMutation.reset();
    convertMutation.reset();
  };

  const handleConfirm = async () => {
    resetFeedback();

    try {
      await confirmMutation.mutateAsync({ appointmentId });
      setLastSuccessKey("confirm");
    } catch {
      // Handled by model state.
    }
  };

  const handleReschedule = async () => {
    resetFeedback();

    const isoScheduledFor = fromDateTimeLocalValue(nextScheduledFor);

    if (!isoScheduledFor || !nextMechanic.trim()) {
      return;
    }

    try {
      await rescheduleMutation.mutateAsync({
        appointmentId,
        scheduledFor: isoScheduledFor,
        assignedMechanic: nextMechanic,
      });
      setLastSuccessKey("reschedule");
    } catch {
      // Handled by model state.
    }
  };

  const handleCancel = async () => {
    resetFeedback();

    try {
      await cancelMutation.mutateAsync({ appointmentId });
      setLastSuccessKey("cancel");
    } catch {
      // Handled by model state.
    }
  };

  const handleConvert = async () => {
    resetFeedback();

    try {
      await convertMutation.mutateAsync({ appointmentId });
      setLastSuccessKey("convert");
    } catch {
      // Handled by model state.
    }
  };

  const isBusy =
    confirmMutation.isPending ||
    rescheduleMutation.isPending ||
    cancelMutation.isPending ||
    convertMutation.isPending;

  const isRescheduleDirty =
    nextScheduledFor !== toDateTimeLocalValue(scheduledFor) || nextMechanic !== assignedMechanic;

  const canConfirm = status === "pending";
  const canReschedule = status !== "cancelled";
  const canCancel = status !== "cancelled";
  const canConvert = status !== "cancelled";

  const currentError =
    confirmMutation.error ?? rescheduleMutation.error ?? cancelMutation.error ?? convertMutation.error;
  const errorMessage = currentError
    ? getErrorMessage(currentError, t("pages.appointments.operations.errorFallback") as string)
    : null;

  const successMessage =
    lastSuccessKey === "confirm"
      ? t("pages.appointments.operations.success.confirm")
      : lastSuccessKey === "reschedule"
        ? t("pages.appointments.operations.success.reschedule")
        : lastSuccessKey === "cancel"
          ? t("pages.appointments.operations.success.cancel")
          : lastSuccessKey === "convert"
            ? t("pages.appointments.operations.success.convert")
            : null;

  return {
    nextScheduledFor,
    setNextScheduledFor,
    nextMechanic,
    setNextMechanic,
    availableMechanics,
    isBusy,
    isRescheduleDirty,
    canConfirm,
    canReschedule,
    canCancel,
    canConvert,
    errorMessage,
    successMessage,
    confirmMutation,
    rescheduleMutation,
    cancelMutation,
    convertMutation,
    handleConfirm,
    handleReschedule,
    handleCancel,
    handleConvert,
  };
};
