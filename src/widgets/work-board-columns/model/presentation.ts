import type { WorkBoardQuickAction, WorkBoardStatus } from "@/entities/work-board/model/types";
import { formatTime, formatUsd, toStatusModifier } from "@/shared/lib/presentation";

export function getWorkBoardStatusModifier(status: WorkBoardStatus) {
  return toStatusModifier(status);
}

export function formatWorkBoardCurrency(value: number) {
  return formatUsd(value);
}

export function formatWorkBoardUpdatedAt(dateIso: string) {
  return formatTime(dateIso, undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getQuickActionTone(action: WorkBoardQuickAction) {
  if (action === "complete") {
    return "success";
  }

  if (action === "wait_parts") {
    return "warning";
  }

  return "neutral";
}
