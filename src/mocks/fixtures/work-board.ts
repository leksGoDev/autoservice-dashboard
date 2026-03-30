import { ORDER_STATUSES } from "@/entities/order/model/options";
import type { OrderPriority } from "@/entities/order/model/types";
import type {
  WorkBoardCard,
  WorkBoardColumn,
  WorkBoardQuickAction,
  WorkBoardStatus,
} from "@/entities/work-board/model/types";
import { ordersFixture, orderMechanicsFixture } from "@/mocks/fixtures/orders";

const BOARD_STATUSES: WorkBoardStatus[] = ORDER_STATUSES.filter(
  (status): status is WorkBoardStatus => status !== "cancelled",
);

function getPriority(totalAmount: number): OrderPriority {
  if (totalAmount >= 900) {
    return "high";
  }

  if (totalAmount >= 500) {
    return "medium";
  }

  return "low";
}

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

function toWorkBoardCard(item: (typeof ordersFixture)[number]): WorkBoardCard | null {
  if (!BOARD_STATUSES.includes(item.status as WorkBoardStatus)) {
    return null;
  }

  const status = item.status as WorkBoardStatus;
  const mechanicIndex = Number(item.id.replace(/\D/g, "")) % orderMechanicsFixture.length;
  const jobsCount = Math.max(1, Math.round(item.totalAmount / 260));

  return {
    id: `wb_${item.id}`,
    orderId: item.id,
    orderNumber: item.number,
    status,
    priority: getPriority(item.totalAmount),
    customerName: item.customerName,
    vehicleLabel: item.vehicleLabel,
    assignedMechanic: orderMechanicsFixture[mechanicIndex],
    jobsCount,
    totalAmount: item.totalAmount,
    shortContext: `${jobsCount} jobs | Updated ${new Date(item.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    updatedAt: item.updatedAt,
    availableActions: getActionsByStatus(status),
  };
}

function sortByUpdatedDesc(left: WorkBoardCard, right: WorkBoardCard) {
  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}

const allBoardCards = ordersFixture.map(toWorkBoardCard).filter((card): card is WorkBoardCard => card !== null);

export const workBoardColumnsFixture: WorkBoardColumn[] = BOARD_STATUSES.map((status) => ({
  status,
  cards: allBoardCards.filter((card) => card.status === status).sort(sortByUpdatedDesc),
}));

export const workBoardFixture = {
  columns: workBoardColumnsFixture,
  totalCards: allBoardCards.length,
  updatedAt: new Date().toISOString(),
};
