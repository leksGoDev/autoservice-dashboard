import { delay, http, HttpResponse } from "msw";

import type { WorkBoardCard, WorkBoardColumn, WorkBoardQuickAction, WorkBoardStatus } from "@/entities/work-board/model/types";
import { ORDER_STATUSES } from "@/entities/order/model/options";
import { getOrdersMockState } from "@/mocks/state/orders";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";

const BOARD_STATUSES: WorkBoardStatus[] = ORDER_STATUSES.filter(
  (status): status is WorkBoardStatus => status !== "cancelled",
);

function getActionsByStatus(status: WorkBoardStatus): WorkBoardQuickAction[] {
  if (status === "scheduled") {
    return ["start_work", "reschedule"];
  }

  if (status === "in_progress") {
    return ["wait_parts", "complete"];
  }

  if (status === "waiting_parts") {
    return ["start_work", "reschedule"];
  }

  return ["reschedule"];
}

function toWorkBoardCard(orderId: string): WorkBoardCard | null {
  const order = getOrdersMockState().find((item) => item.id === orderId);

  if (!order || !BOARD_STATUSES.includes(order.status as WorkBoardStatus)) {
    return null;
  }

  const status = order.status as WorkBoardStatus;

  return {
    id: `wb_${order.id}`,
    orderId: order.id,
    orderNumber: order.number,
    status,
    priority: order.priority,
    customerName: order.customerName,
    vehicleLabel: order.vehicleLabel,
    assignedMechanic: order.assignedMechanic,
    jobsCount: order.jobsCount,
    totalAmount: order.totalAmount,
    shortContext: `${order.jobsCount} jobs | Updated ${new Date(order.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    updatedAt: order.updatedAt,
    availableActions: getActionsByStatus(status),
  };
}

function sortByUpdatedDesc(left: WorkBoardCard, right: WorkBoardCard) {
  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}

function buildWorkBoardColumns(): WorkBoardColumn[] {
  const cards = getOrdersMockState()
    .map((item) => toWorkBoardCard(item.id))
    .filter((item): item is WorkBoardCard => item !== null);

  return BOARD_STATUSES.map((status) => ({
    status,
    cards: cards.filter((card) => card.status === status).sort(sortByUpdatedDesc),
  }));
}

export const workBoardHandlers = [
  http.get(toMswPath(apiEndpoints.workBoard.board), async () => {
    await delay(250);

    const columns = buildWorkBoardColumns();
    const totalCards = columns.reduce((sum, column) => sum + column.cards.length, 0);

    return HttpResponse.json({
      columns,
      totalCards,
      updatedAt: new Date().toISOString(),
    });
  }),
];
