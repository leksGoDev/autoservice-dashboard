import { delay, http, HttpResponse } from "msw";

import type { AnalyticsRange } from "@/entities/analytics/model/types";
import { DASHBOARD_RANGES, DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";
import {
  getAnalyticsJobsByCategoryFixtureByRange,
  getAnalyticsMechanicWorkloadFixtureByRange,
  getAnalyticsMetricsFixtureByRange,
  getAnalyticsOrdersPerDayFixtureByRange,
  getAnalyticsRevenueFixtureByRange,
} from "@/mocks/fixtures/analytics";
import { INVALID_DASHBOARD_RANGE_MESSAGE } from "@/shared/api/messages";

function parseAnalyticsRange(input: string | null): AnalyticsRange | null {
  if (input === null) {
    return DEFAULT_DASHBOARD_RANGE;
  }

  if (DASHBOARD_RANGES.includes(input as AnalyticsRange)) {
    return input as AnalyticsRange;
  }

  return null;
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

export const analyticsHandlers = [
  http.get(toMswPath(apiEndpoints.analytics.metrics), async ({ request }) => {
    await delay(220);
    const url = new URL(request.url);
    const range = parseAnalyticsRange(url.searchParams.get("range"));

    if (!range) {
      return invalidRangeResponse();
    }

    return HttpResponse.json(getAnalyticsMetricsFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.analytics.revenue), async ({ request }) => {
    await delay(220);
    const url = new URL(request.url);
    const range = parseAnalyticsRange(url.searchParams.get("range"));

    if (!range) {
      return invalidRangeResponse();
    }

    return HttpResponse.json(getAnalyticsRevenueFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.analytics.ordersPerDay), async ({ request }) => {
    await delay(220);
    const url = new URL(request.url);
    const range = parseAnalyticsRange(url.searchParams.get("range"));

    if (!range) {
      return invalidRangeResponse();
    }

    return HttpResponse.json(getAnalyticsOrdersPerDayFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.analytics.jobsByCategory), async ({ request }) => {
    await delay(220);
    const url = new URL(request.url);
    const range = parseAnalyticsRange(url.searchParams.get("range"));

    if (!range) {
      return invalidRangeResponse();
    }

    return HttpResponse.json(getAnalyticsJobsByCategoryFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.analytics.mechanicWorkload), async ({ request }) => {
    await delay(220);
    const url = new URL(request.url);
    const range = parseAnalyticsRange(url.searchParams.get("range"));

    if (!range) {
      return invalidRangeResponse();
    }

    return HttpResponse.json(getAnalyticsMechanicWorkloadFixtureByRange(range));
  }),
];
