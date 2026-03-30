import type {
  DashboardMetrics,
  DashboardOrdersTrendPoint,
  DashboardRange,
  DashboardRevenuePoint,
  MechanicWorkloadItem,
  RecentActivityItem,
  RecentOrderItem,
} from "@/entities/dashboard/model/types";
import type { OrderActivityItem, OrderActivityType, OrderStatus } from "@/entities/order/model/types";
import { getOrdersMockState } from "@/mocks/state/orders";
import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { getMechanicsWorkloadFixtureByRange } from "./mechanics";

const RANGE_DAYS: Record<DashboardRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

function getAnchorDate() {
  const orders = getOrdersMockState();
  const timestamps = orders.flatMap((order) => [order.createdAt, order.updatedAt]).map((value) => new Date(value).getTime());
  return new Date(timestamps.length > 0 ? Math.max(...timestamps) : Date.now());
}

function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getStartDateForRange(range: DashboardRange) {
  const date = getAnchorDate();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - (RANGE_DAYS[range] - 1));
  return date;
}

function isOrderInsideRange(isoDate: string, range: DashboardRange) {
  const timestamp = new Date(isoDate).getTime();
  const startTimestamp = getStartDateForRange(range).getTime();
  const endTimestamp = getAnchorDate().getTime();
  return timestamp >= startTimestamp && timestamp <= endTimestamp;
}

function getOrdersInRange(range: DashboardRange) {
  return getOrdersMockState().filter((order) => order.status !== "cancelled" && isOrderInsideRange(order.updatedAt, range));
}

function getDashboardActivityType(activityType: OrderActivityType): RecentActivityItem["type"] {
  if (activityType === "order_created") {
    return "order_created";
  }

  if (activityType === "order_scheduled") {
    return "order_scheduled";
  }

  if (activityType === "mechanic_assigned" || activityType === "job_mechanic_assigned") {
    return "mechanic_assigned";
  }

  if (activityType === "part_added" || activityType === "part_quantity_updated" || activityType === "part_removed") {
    return "parts_updated";
  }

  return "status_changed";
}

function buildRecentActivityMessage(orderNumber: string, activity: OrderActivityItem) {
  if (activity.type === "status_changed" || activity.type === "order_completed") {
    return `${orderNumber}: ${activity.description}`;
  }

  return activity.description;
}

export function getMetricsFixtureByRange(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  const orders = getOrdersInRange(range);
  const anchorDate = getAnchorDate();
  const today = formatIsoDate(anchorDate);
  const currentMonth = today.slice(0, 7);

  return {
    active: orders.filter((order) => order.status === "in_progress" || order.status === "waiting_parts").length,
    overdue: orders.filter((order) => order.status === "waiting_parts").length,
    scheduled: orders.filter((order) => order.status === "scheduled").length,
    revenueToday: orders
      .filter((order) => formatIsoDate(new Date(order.updatedAt)) === today)
      .reduce((sum, order) => sum + order.totalAmount, 0),
    revenueThisMonth: orders
      .filter((order) => formatIsoDate(new Date(order.updatedAt)).startsWith(currentMonth))
      .reduce((sum, order) => sum + order.totalAmount, 0),
  };
}

export function getRevenueFixtureByRange(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  const startDate = getStartDateForRange(range);
  const points: DashboardRevenuePoint[] = [];
  const orders = getOrdersInRange(range);

  for (let dayOffset = 0; dayOffset < RANGE_DAYS[range]; dayOffset += 1) {
    const pointDate = new Date(startDate);
    pointDate.setUTCDate(startDate.getUTCDate() + dayOffset);
    const date = formatIsoDate(pointDate);
    const revenue = orders
      .filter((order) => formatIsoDate(new Date(order.updatedAt)) === date)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    points.push({ date, revenue });
  }

  return points;
}

export function getOrdersTrendFixtureByRange(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  const startDate = getStartDateForRange(range);
  const points: DashboardOrdersTrendPoint[] = [];
  const orders = getOrdersInRange(range);

  for (let dayOffset = 0; dayOffset < RANGE_DAYS[range]; dayOffset += 1) {
    const pointDate = new Date(startDate);
    pointDate.setUTCDate(startDate.getUTCDate() + dayOffset);
    const date = formatIsoDate(pointDate);
    const ordersForDay = orders.filter((order) => formatIsoDate(new Date(order.updatedAt)) === date);

    points.push({
      date,
      total: ordersForDay.length,
      completed: ordersForDay.filter((order) => order.status === "completed").length,
    });
  }

  return points;
}

export function getRecentActivityFixtureByRange(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return getOrdersInRange(range)
    .flatMap((order) =>
      order.activity.map<RecentActivityItem>((activity) => ({
        id: `dashboard_${activity.id}`,
        type: getDashboardActivityType(activity.type),
        createdAt: activity.timestamp,
        message: buildRecentActivityMessage(order.number, activity),
        orderId: order.id,
      })),
    )
    .filter((item) => isOrderInsideRange(item.createdAt, range))
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 6);
}

export function getRecentOrdersFixtureByRange(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return getOrdersInRange(range)
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .map<RecentOrderItem>((order) => ({
      id: order.id,
      number: order.number,
      customerName: order.customerName,
      vehicleLabel: order.vehicleLabel,
      status: order.status,
      priority: order.priority,
      assignedMechanic: order.assignedMechanic,
      jobsCount: order.jobsCount,
      totalCost: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
}

export function getMechanicWorkloadFixtureByRange(range: DashboardRange = DEFAULT_DASHBOARD_RANGE): MechanicWorkloadItem[] {
  return getMechanicsWorkloadFixtureByRange(range);
}
