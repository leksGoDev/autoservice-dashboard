import { useState } from "react";
import type { UseQueryResult } from "@tanstack/react-query";

import { useAnalyticsOverviewQuery } from "@/entities/analytics/api/queries";
import type { AnalyticsOverview, AnalyticsRange } from "@/entities/analytics/model/types";
import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";

export type AnalyticsOverviewModel = {
  range: AnalyticsRange;
  setRange: (range: AnalyticsRange) => void;
  query: UseQueryResult<AnalyticsOverview, Error>;
};

export const useAnalyticsOverviewModel = (): AnalyticsOverviewModel => {
  const [range, setRange] = useState<AnalyticsRange>(DEFAULT_DASHBOARD_RANGE);
  const query = useAnalyticsOverviewQuery(range);

  return {
    range,
    setRange,
    query,
  };
};
