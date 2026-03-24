import type {
  AnalyticsMetrics,
  AnalyticsOrdersPerDayPoint,
  AnalyticsRange,
  AnalyticsRevenuePoint,
  AnalyticsMechanicWorkloadItem,
  JobsByCategoryPoint,
} from "@/entities/analytics/model/types";
import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import {
  getMechanicWorkloadFixtureByRange,
  getOrdersTrendFixtureByRange,
  getRevenueFixtureByRange,
} from "./dashboard";

const jobsByCategoryByRange: Record<AnalyticsRange, JobsByCategoryPoint[]> = {
  "7d": [
    { category: "Diagnostics", scheduled: 6, inProgress: 4, completed: 9 },
    { category: "Engine", scheduled: 4, inProgress: 3, completed: 7 },
    { category: "Electrical", scheduled: 3, inProgress: 2, completed: 6 },
    { category: "Brake", scheduled: 2, inProgress: 1, completed: 5 },
  ],
  "30d": [
    { category: "Diagnostics", scheduled: 15, inProgress: 11, completed: 24 },
    { category: "Engine", scheduled: 12, inProgress: 9, completed: 21 },
    { category: "Electrical", scheduled: 9, inProgress: 7, completed: 17 },
    { category: "Brake", scheduled: 8, inProgress: 5, completed: 14 },
  ],
  "90d": [
    { category: "Diagnostics", scheduled: 37, inProgress: 29, completed: 62 },
    { category: "Engine", scheduled: 31, inProgress: 23, completed: 54 },
    { category: "Electrical", scheduled: 26, inProgress: 18, completed: 42 },
    { category: "Brake", scheduled: 21, inProgress: 14, completed: 35 },
  ],
};

function buildMetrics(range: AnalyticsRange): AnalyticsMetrics {
  const revenue = getRevenueFixtureByRange(range);
  const orders = getOrdersTrendFixtureByRange(range);
  const workload = getMechanicWorkloadFixtureByRange(range);

  const totalRevenue = revenue[revenue.length - 1]?.revenue ?? 0;
  const totalOrders = orders.reduce((sum, item) => sum + item.total, 0);
  const completedOrders = orders.reduce((sum, item) => sum + item.completed, 0);
  const averageOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const completionRate = totalOrders ? Math.round((completedOrders / totalOrders) * 100) : 0;
  const activeMechanics = workload.filter((item) => item.assignedOrders > 0).length;

  return {
    totalRevenue,
    averageOrderValue,
    completionRate,
    activeMechanics,
  };
}

export function getAnalyticsMetricsFixtureByRange(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE) {
  return buildMetrics(range);
}

export function getAnalyticsRevenueFixtureByRange(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE): AnalyticsRevenuePoint[] {
  return getRevenueFixtureByRange(range);
}

export function getAnalyticsOrdersPerDayFixtureByRange(
  range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE,
): AnalyticsOrdersPerDayPoint[] {
  return getOrdersTrendFixtureByRange(range);
}

export function getAnalyticsJobsByCategoryFixtureByRange(
  range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE,
): JobsByCategoryPoint[] {
  return jobsByCategoryByRange[range];
}

export function getAnalyticsMechanicWorkloadFixtureByRange(
  range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE,
): AnalyticsMechanicWorkloadItem[] {
  return getMechanicWorkloadFixtureByRange(range);
}
