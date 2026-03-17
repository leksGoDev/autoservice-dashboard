import { delay, http, HttpResponse } from "msw";

import type { DashboardRange } from "@/entities/dashboard/model/types";
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

  return "30d";
}

export const dashboardHandlers = [
  http.get("/api/dashboard/metrics", async () => {
    await delay(250);
    return HttpResponse.json(dashboardMetricsFixture);
  }),

  http.get("/api/dashboard/revenue", async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const range = parseDashboardRange(url.searchParams.get("range"));

    return HttpResponse.json(getRevenueFixtureByRange(range));
  }),

  http.get("/api/dashboard/orders-trend", async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const range = parseDashboardRange(url.searchParams.get("range"));

    return HttpResponse.json(getOrdersTrendFixtureByRange(range));
  }),

  http.get("/api/dashboard/mechanic-workload", async () => {
    await delay(250);
    return HttpResponse.json(mechanicWorkloadFixture);
  }),

  http.get("/api/dashboard/recent-activity", async () => {
    await delay(250);
    return HttpResponse.json(recentActivityFixture);
  }),

  http.get("/api/dashboard/recent-orders", async () => {
    await delay(250);
    return HttpResponse.json(recentOrdersFixture);
  }),
];
