import { useEffect, useMemo, useState } from "react";

import type { OrderStatus } from "@/entities/order/model/types";
import {
  useAssignOrderMechanicMutation,
  useSetOrderFlagMutation,
  useUpdateOrderStatusMutation,
} from "@/features/order-operations/api/mutations";
import { isApiError } from "@/shared/api/api-error";
import { useI18n } from "@/shared/i18n/use-i18n";

type LastSuccessKey = "status" | "mechanic" | "flagged" | "unflagged";

type UseOrderOperationsControlsModelParams = {
  orderId: string;
  status: OrderStatus;
  assignedMechanic: string;
  flagged: boolean;
  mechanics: string[];
};

function getErrorMessage(error: unknown, fallback: string) {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export const useOrderOperationsControlsModel = ({
  orderId,
  status,
  assignedMechanic,
  flagged,
  mechanics,
}: UseOrderOperationsControlsModelParams) => {
  const { t } = useI18n();

  const [nextStatus, setNextStatus] = useState<OrderStatus>(status);
  const [nextMechanic, setNextMechanic] = useState(assignedMechanic);
  const [lastSuccessKey, setLastSuccessKey] = useState<LastSuccessKey | null>(null);

  const updateStatusMutation = useUpdateOrderStatusMutation();
  const assignMechanicMutation = useAssignOrderMechanicMutation();
  const setFlagMutation = useSetOrderFlagMutation();

  useEffect(() => {
    setNextStatus(status);
  }, [status]);

  useEffect(() => {
    setNextMechanic(assignedMechanic);
  }, [assignedMechanic]);

  const availableMechanics = useMemo(() => {
    const normalized = new Set(mechanics.filter((item) => item.trim().length > 0));

    if (assignedMechanic.trim().length > 0) {
      normalized.add(assignedMechanic);
    }

    return [...normalized].sort((left, right) => left.localeCompare(right));
  }, [assignedMechanic, mechanics]);

  const resetFeedback = () => {
    setLastSuccessKey(null);
    updateStatusMutation.reset();
    assignMechanicMutation.reset();
    setFlagMutation.reset();
  };

  const handleStatusUpdate = async () => {
    resetFeedback();

    try {
      await updateStatusMutation.mutateAsync({
        orderId,
        status: nextStatus,
      });
      setLastSuccessKey("status");
    } catch {
      // Mutation error is handled by query state and rendered from model.
    }
  };

  const handleAssignMechanic = async () => {
    resetFeedback();

    try {
      await assignMechanicMutation.mutateAsync({
        orderId,
        assignedMechanic: nextMechanic,
      });
      setLastSuccessKey("mechanic");
    } catch {
      // Mutation error is handled by query state and rendered from model.
    }
  };

  const handleFlagToggle = async () => {
    resetFeedback();

    try {
      await setFlagMutation.mutateAsync({
        orderId,
        flagged: !flagged,
      });
      setLastSuccessKey(flagged ? "unflagged" : "flagged");
    } catch {
      // Mutation error is handled by query state and rendered from model.
    }
  };

  const isStatusDirty = nextStatus !== status;
  const isMechanicDirty = nextMechanic !== assignedMechanic;
  const isBusy =
    updateStatusMutation.isPending || assignMechanicMutation.isPending || setFlagMutation.isPending;

  const currentError = updateStatusMutation.error ?? assignMechanicMutation.error ?? setFlagMutation.error;
  const errorMessage = currentError
    ? getErrorMessage(currentError, t("pages.orders.operations.errorFallback") as string)
    : null;

  const successMessage =
    lastSuccessKey === "status"
      ? t("pages.orders.operations.success.status")
      : lastSuccessKey === "mechanic"
        ? t("pages.orders.operations.success.mechanic")
        : lastSuccessKey === "flagged"
          ? t("pages.orders.operations.success.flagged")
          : lastSuccessKey === "unflagged"
            ? t("pages.orders.operations.success.unflagged")
            : null;

  return {
    nextStatus,
    setNextStatus,
    nextMechanic,
    setNextMechanic,
    availableMechanics,
    isStatusDirty,
    isMechanicDirty,
    isBusy,
    errorMessage,
    successMessage,
    updateStatusMutation,
    assignMechanicMutation,
    setFlagMutation,
    handleStatusUpdate,
    handleAssignMechanic,
    handleFlagToggle,
  };
};
