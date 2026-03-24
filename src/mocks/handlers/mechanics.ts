import { delay, http, HttpResponse } from "msw";

import type { MechanicsRange } from "@/entities/mechanic/model/types";
import {
  DASHBOARD_RANGES,
  DEFAULT_DASHBOARD_RANGE,
} from "@/shared/api/constants";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";
import { getMechanicsWorkloadFixtureByRange, mechanicsRegistryFixture } from "@/mocks/fixtures/mechanics";
import { INVALID_DASHBOARD_RANGE_MESSAGE } from "@/shared/api/messages";
import { paginateItems, parseListQueryParams } from "@/mocks/lib/list";

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
    const { page, pageSize, search } = parseListQueryParams(url);

    let filtered = mechanicsRegistryFixture;

    if (search) {
      filtered = filtered.filter((item) => {
        const haystack = `${item.name} ${item.specialization}`.toLowerCase();
        return haystack.includes(search);
      });
    }

    return HttpResponse.json(paginateItems(filtered, page, pageSize));
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
