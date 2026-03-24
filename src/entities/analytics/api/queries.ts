import { useQuery } from "@tanstack/react-query";

import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { queryKeys } from "@/shared/api/query-keys";
import type { AnalyticsRange } from "../model/types";
import {
  getAnalyticsJobsByCategory,
  getAnalyticsMechanicWorkload,
  getAnalyticsMetrics,
  getAnalyticsOrdersPerDay,
  getAnalyticsOverview,
  getAnalyticsRevenue,
} from "./requests";

export function useAnalyticsMetricsQuery(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.analytics.metrics(range),
    queryFn: () => getAnalyticsMetrics(range),
  });
}

export function useAnalyticsRevenueQuery(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.analytics.revenue(range),
    queryFn: () => getAnalyticsRevenue(range),
  });
}

export function useAnalyticsOrdersPerDayQuery(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.analytics.ordersPerDay(range),
    queryFn: () => getAnalyticsOrdersPerDay(range),
  });
}

export function useAnalyticsJobsByCategoryQuery(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.analytics.jobsByCategory(range),
    queryFn: () => getAnalyticsJobsByCategory(range),
  });
}

export function useAnalyticsMechanicWorkloadQuery(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.analytics.mechanicWorkload(range),
    queryFn: () => getAnalyticsMechanicWorkload(range),
  });
}

export function useAnalyticsOverviewQuery(range: AnalyticsRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.analytics.overview(range),
    queryFn: () => getAnalyticsOverview(range),
  });
}
