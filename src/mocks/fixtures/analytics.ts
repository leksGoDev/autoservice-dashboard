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
import { getOrdersMockState } from "@/mocks/state/orders";

function buildMetrics(range: AnalyticsRange): AnalyticsMetrics {
  const revenue = getRevenueFixtureByRange(range);
  const orders = getOrdersTrendFixtureByRange(range);
  const workload = getMechanicWorkloadFixtureByRange(range);

  const totalRevenue = revenue.reduce((sum, item) => sum + item.revenue, 0);
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

function buildJobsByCategory(range: AnalyticsRange): JobsByCategoryPoint[] {
  const recentDates = new Set(getOrdersTrendFixtureByRange(range).map((item) => item.date));
  const totalsByCategory = getOrdersMockState().reduce<Record<string, JobsByCategoryPoint>>((accumulator, order) => {
    if (!recentDates.has(order.updatedAt.slice(0, 10))) {
      return accumulator;
    }

    order.jobs.forEach((job) => {
      const existing = accumulator[job.category] ?? {
        category: job.category,
        scheduled: 0,
        inProgress: 0,
        completed: 0,
      };

      if (job.status === "pending") {
        existing.scheduled += 1;
      } else if (job.status === "completed") {
        existing.completed += 1;
      } else {
        existing.inProgress += 1;
      }

      accumulator[job.category] = existing;
    });

    return accumulator;
  }, {});

  return Object.values(totalsByCategory).sort((left, right) => left.category.localeCompare(right.category));
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
  return buildJobsByCategory(range);
}

export function getAnalyticsMechanicWorkloadFixtureByRange(
  range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE,
): AnalyticsMechanicWorkloadItem[] {
  return getMechanicWorkloadFixtureByRange(range);
}
