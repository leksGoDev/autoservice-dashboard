import { delay, http, HttpResponse } from "msw";

import type { DashboardRange } from "@/entities/dashboard/model/types";
import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";
import {
  dashboardMetricsFixture,
  getOrdersTrendFixtureByRange,
  getRevenueFixtureByRange,
  mechanicWorkloadFixture,
  recentActivityFixture,
  recentOrdersFixture,
} from "@/mocks/fixtures/dashboard";

function parseDashboardRange(input: string | null): DashboardRange {
  if (input === "7d" || input === "30d" || input === "90d") {
    return input;
  }

  return DEFAULT_DASHBOARD_RANGE;
}

export const dashboardHandlers = [
  http.get(toMswPath(apiEndpoints.dashboard.metrics), async () => {
    await delay(250);
    return HttpResponse.json(dashboardMetricsFixture);
  }),

  http.get(toMswPath(apiEndpoints.dashboard.revenue), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const range = parseDashboardRange(url.searchParams.get("range"));

    return HttpResponse.json(getRevenueFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.dashboard.ordersTrend), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const range = parseDashboardRange(url.searchParams.get("range"));

    return HttpResponse.json(getOrdersTrendFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.dashboard.mechanicWorkload), async () => {
    await delay(250);
    return HttpResponse.json(mechanicWorkloadFixture);
  }),

  http.get(toMswPath(apiEndpoints.dashboard.recentActivity), async () => {
    await delay(250);
    return HttpResponse.json(recentActivityFixture);
  }),

  http.get(toMswPath(apiEndpoints.dashboard.recentOrders), async () => {
    await delay(250);
    return HttpResponse.json(recentOrdersFixture);
  }),
];
