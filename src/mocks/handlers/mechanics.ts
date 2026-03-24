import { delay, http, HttpResponse } from "msw";

import type { MechanicsRange } from "@/entities/mechanic/model/types";
import {
  DASHBOARD_RANGES,
  DEFAULT_DASHBOARD_RANGE,
  DEFAULT_LIST_PAGE,
  DEFAULT_LIST_PAGE_SIZE,
} from "@/shared/api/constants";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";
import { getMechanicsWorkloadFixtureByRange, mechanicsRegistryFixture } from "@/mocks/fixtures/mechanics";
import { INVALID_DASHBOARD_RANGE_MESSAGE } from "@/shared/api/messages";

function parseDashboardRange(input: string | null): MechanicsRange | null {
  if (input === null) {
    return DEFAULT_DASHBOARD_RANGE;
  }

  if (DASHBOARD_RANGES.includes(input as MechanicsRange)) {
    return input as MechanicsRange;
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

export const mechanicsHandlers = [
  http.get(toMswPath(apiEndpoints.mechanics.registry), async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? String(DEFAULT_LIST_PAGE));
    const pageSize = Number(url.searchParams.get("pageSize") ?? String(DEFAULT_LIST_PAGE_SIZE));
    const search = (url.searchParams.get("search") ?? "").toLowerCase().trim();

    let filtered = mechanicsRegistryFixture;

    if (search) {
      filtered = filtered.filter((item) => {
        const haystack = `${item.name} ${item.specialization}`.toLowerCase();
        return haystack.includes(search);
      });
    }

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));
    const start = (safePage - 1) * safePageSize;
    const items = filtered.slice(start, start + safePageSize);

    return HttpResponse.json({
      items,
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages,
    });
  }),

  http.get(toMswPath(apiEndpoints.mechanics.workload), async ({ request }) => {
    await delay(240);
    const url = new URL(request.url);
    const range = parseDashboardRange(url.searchParams.get("range"));

    if (!range) {
      return invalidRangeResponse();
    }

    return HttpResponse.json(getMechanicsWorkloadFixtureByRange(range));
  }),
];
