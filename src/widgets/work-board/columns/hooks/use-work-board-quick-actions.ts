import type { WorkBoardQuickAction, WorkBoardStatus } from "@/entities/work-board/model/types";
import { useUpdateOrderStatusMutation } from "@/features/order-operations/api/mutations";
import { getMutationErrorMessage } from "@/features/order-operations/model/get-mutation-error-message";
import { useI18n } from "@/shared/i18n/use-i18n";
import { useState } from "react";

const QUICK_ACTION_STATUS_MAP: Record<WorkBoardQuickAction, WorkBoardStatus> = {
  start_work: "in_progress",
  wait_parts: "waiting_parts",
  complete: "completed",
  reschedule: "scheduled",
};

export const useWorkBoardQuickActions = () => {
  const { t } = useI18n();
  const updateOrderStatusMutation = useUpdateOrderStatusMutation();
  const [errorByOrderId, setErrorByOrderId] = useState<Record<string, string>>({});
  const [pendingAction, setPendingAction] = useState<{
    orderId: string;
    action: WorkBoardQuickAction;
  } | null>(null);

  const handleQuickAction = async (orderId: string, action: WorkBoardQuickAction) => {
    setPendingAction({ orderId, action });
    setErrorByOrderId((previous) => {
      const next = { ...previous };
      delete next[orderId];
      return next;
    });

    try {
      await updateOrderStatusMutation.mutateAsync({
        orderId,
        status: QUICK_ACTION_STATUS_MAP[action],
      });
    } catch (error) {
      const errorMessage = getMutationErrorMessage(error, t("pages.workBoard.quickActions.errorFallback") as string);

      setErrorByOrderId((previous) => ({
        ...previous,
        [orderId]: errorMessage,
      }));
    } finally {
      setPendingAction(null);
    }
  };

  const isPendingAction = (orderId: string, action: WorkBoardQuickAction) =>
    updateOrderStatusMutation.isPending && pendingAction?.orderId === orderId && pendingAction.action === action;

  const isOrderPending = (orderId: string) =>
    updateOrderStatusMutation.isPending && pendingAction?.orderId === orderId;

  return {
    errorByOrderId,
    isMutating: updateOrderStatusMutation.isPending,
    isPendingAction,
    isOrderPending,
    handleQuickAction,
  };
};
