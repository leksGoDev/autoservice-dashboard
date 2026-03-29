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
import { invalidRangeResponse, parseRangeParam } from "@/mocks/lib/range";

export const analyticsHandlers = [
  http.get(toMswPath(apiEndpoints.analytics.metrics), async ({ request }) => {
    await delay(220);
    const url = new URL(request.url);
    const range = parseRangeParam(url.searchParams.get("range"), {
      allowedRanges: DASHBOARD_RANGES,
      defaultRange: DEFAULT_DASHBOARD_RANGE,
    }) as AnalyticsRange | null;

    if (!range) {
      return invalidRangeResponse(INVALID_DASHBOARD_RANGE_MESSAGE);
    }

    return HttpResponse.json(getAnalyticsMetricsFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.analytics.revenue), async ({ request }) => {
    await delay(220);
    const url = new URL(request.url);
    const range = parseRangeParam(url.searchParams.get("range"), {
      allowedRanges: DASHBOARD_RANGES,
      defaultRange: DEFAULT_DASHBOARD_RANGE,
    }) as AnalyticsRange | null;

    if (!range) {
      return invalidRangeResponse(INVALID_DASHBOARD_RANGE_MESSAGE);
    }

    return HttpResponse.json(getAnalyticsRevenueFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.analytics.ordersPerDay), async ({ request }) => {
    await delay(220);
    const url = new URL(request.url);
    const range = parseRangeParam(url.searchParams.get("range"), {
      allowedRanges: DASHBOARD_RANGES,
      defaultRange: DEFAULT_DASHBOARD_RANGE,
    }) as AnalyticsRange | null;

    if (!range) {
      return invalidRangeResponse(INVALID_DASHBOARD_RANGE_MESSAGE);
    }

    return HttpResponse.json(getAnalyticsOrdersPerDayFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.analytics.jobsByCategory), async ({ request }) => {
    await delay(220);
    const url = new URL(request.url);
    const range = parseRangeParam(url.searchParams.get("range"), {
      allowedRanges: DASHBOARD_RANGES,
      defaultRange: DEFAULT_DASHBOARD_RANGE,
    }) as AnalyticsRange | null;

    if (!range) {
      return invalidRangeResponse(INVALID_DASHBOARD_RANGE_MESSAGE);
    }

    return HttpResponse.json(getAnalyticsJobsByCategoryFixtureByRange(range));
  }),

  http.get(toMswPath(apiEndpoints.analytics.mechanicWorkload), async ({ request }) => {
    await delay(220);
    const url = new URL(request.url);
    const range = parseRangeParam(url.searchParams.get("range"), {
      allowedRanges: DASHBOARD_RANGES,
      defaultRange: DEFAULT_DASHBOARD_RANGE,
    }) as AnalyticsRange | null;

    if (!range) {
      return invalidRangeResponse(INVALID_DASHBOARD_RANGE_MESSAGE);
    }

    return HttpResponse.json(getAnalyticsMechanicWorkloadFixtureByRange(range));
  }),
];
