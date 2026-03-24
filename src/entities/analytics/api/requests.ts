import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type {
  AnalyticsMetrics,
  AnalyticsOrdersPerDayPoint,
  AnalyticsOverview,
  AnalyticsRange,
  AnalyticsRevenuePoint,
  AnalyticsMechanicWorkloadItem,
  JobsByCategoryPoint,
} from "../model/types";

export function getAnalyticsMetrics(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE) {
  return httpRequest<AnalyticsMetrics>(apiEndpoints.analytics.metrics, {
    method: "GET",
    query: { range },
  });
}

export function getAnalyticsRevenue(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE) {
  return httpRequest<AnalyticsRevenuePoint[]>(apiEndpoints.analytics.revenue, {
    method: "GET",
    query: { range },
  });
}

export function getAnalyticsOrdersPerDay(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE) {
  return httpRequest<AnalyticsOrdersPerDayPoint[]>(apiEndpoints.analytics.ordersPerDay, {
    method: "GET",
    query: { range },
  });
}

export function getAnalyticsJobsByCategory(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE) {
  return httpRequest<JobsByCategoryPoint[]>(apiEndpoints.analytics.jobsByCategory, {
    method: "GET",
    query: { range },
  });
}

export function getAnalyticsMechanicWorkload(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE) {
  return httpRequest<AnalyticsMechanicWorkloadItem[]>(apiEndpoints.analytics.mechanicWorkload, {
    method: "GET",
    query: { range },
  });
}

export async function getAnalyticsOverview(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE): Promise<AnalyticsOverview> {
  const [metrics, revenue, ordersPerDay, jobsByCategory, mechanicWorkload] = await Promise.all([
    getAnalyticsMetrics(range),
    getAnalyticsRevenue(range),
    getAnalyticsOrdersPerDay(range),
    getAnalyticsJobsByCategory(range),
    getAnalyticsMechanicWorkload(range),
  ]);

  return {
    metrics,
    revenue,
    ordersPerDay,
    jobsByCategory,
    mechanicWorkload,
  };
}
