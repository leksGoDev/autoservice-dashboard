import { delay, http, HttpResponse } from "msw";

import type { DashboardRange } from "@/entities/dashboard/model/types";
import {
  DASHBOARD_RANGES,
  DEFAULT_DASHBOARD_RANGE,
  DEFAULT_DASHBOARD_RECENT_ORDERS_LIMIT,
} from "@/shared/api/constants";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";
import {
  getMechanicWorkloadFixtureByRange,
  getMetricsFixtureByRange,
  getOrdersTrendFixtureByRange,
  getRecentActivityFixtureByRange,
  getRecentOrdersFixtureByRange,
  getRevenueFixtureByRange,
} from "@/mocks/fixtures/dashboard";
import { INVALID_DASHBOARD_LIMIT_MESSAGE, INVALID_DASHBOARD_RANGE_MESSAGE } from "@/shared/api/messages";

function parseDashboardRange(input: string | null): DashboardRange | null {
  if (input === null) {
    return DEFAULT_DASHBOARD_RANGE;
  }

  if (DASHBOARD_RANGES.includes(input as DashboardRange)) {
    return input as DashboardRange;
  }

  return null;
}

function parseLimit(input: string | null): number | null {
  if (input === null) {
    return DEFAULT_DASHBOARD_RECENT_ORDERS_LIMIT;
  }

  const value = Number(input);

  if (!Number.isInteger(value) || value <= 0) {
    return null;
  }

  return value;
}

function invalidRangeResponse() {
  return HttpResponse.json(
    {
      code: "INVALID_RANGE",
      message: INVALID_DASHBOARD_RANGE_MESSAGE,
    },
    { status: 400 },
  );
}

function invalidLimitResponse() {
  return HttpResponse.json(
    {
      code: "INVALID_LIMIT",
      message: INVALID_DASHBOARD_LIMIT_MESSAGE,
    },
    { status: 400 },
  );
}

export const dashboardHandlers = [
  http.get(toMswPath(apiEndpoints.dashboard.metrics), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const range = parseDashboardRange(url.searchParams.get("range"));

    if (!range) {
      return invalidRangeResponse();
    }

    return HttpResponse.json(getMetricsFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.dashboard.revenue), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const range = parseDashboardRange(url.searchParams.get("range"));

    if (!range) {
      return invalidRangeResponse();
    }

    return HttpResponse.json(getRevenueFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.dashboard.ordersTrend), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const range = parseDashboardRange(url.searchParams.get("range"));

    if (!range) {
      return invalidRangeResponse();
    }

    return HttpResponse.json(getOrdersTrendFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.dashboard.mechanicWorkload), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const range = parseDashboardRange(url.searchParams.get("range"));

    if (!range) {
      return invalidRangeResponse();
    }

    return HttpResponse.json(getMechanicWorkloadFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.dashboard.recentActivity), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const range = parseDashboardRange(url.searchParams.get("range"));

    if (!range) {
      return invalidRangeResponse();
    }

    return HttpResponse.json(getRecentActivityFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.dashboard.recentOrders), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const range = parseDashboardRange(url.searchParams.get("range"));
    const limit = parseLimit(url.searchParams.get("limit"));

    if (!range) {
      return invalidRangeResponse();
    }

    if (!limit) {
      return invalidLimitResponse();
    }

    const sorted = [...getRecentOrdersFixtureByRange(range)].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    return HttpResponse.json(sorted.slice(0, limit));
  }),
];
