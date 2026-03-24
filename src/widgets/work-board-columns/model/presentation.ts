import type { WorkBoardQuickAction, WorkBoardStatus } from "@/entities/work-board/model/types";

export function getWorkBoardStatusModifier(status: WorkBoardStatus) {
  return status.replace("_", "-");
}

export function formatWorkBoardCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

export function formatWorkBoardUpdatedAt(dateIso: string) {
  return new Date(dateIso).toLocaleTimeString([], {
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
