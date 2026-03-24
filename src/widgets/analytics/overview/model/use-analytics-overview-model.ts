import { useState } from "react";

import { useAnalyticsOverviewQuery } from "@/entities/analytics/api/queries";
import type { AnalyticsRange } from "@/entities/analytics/model/types";
import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";

export const useAnalyticsOverviewModel = () => {
  const [range, setRange] = useState<AnalyticsRange>(DEFAULT_DASHBOARD_RANGE);
  const query = useAnalyticsOverviewQuery(range);

  return {
    range,
    setRange,
    query,
  };
};
