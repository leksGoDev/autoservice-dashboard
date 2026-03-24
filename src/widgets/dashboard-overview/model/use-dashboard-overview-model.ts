import { useState } from "react";

import { useDashboardOverviewQuery } from "@/entities/dashboard/api/queries";
import type { DashboardRange } from "@/entities/dashboard/model/types";
import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";

export const useDashboardOverviewModel = () => {
  const [range, setRange] = useState<DashboardRange>(DEFAULT_DASHBOARD_RANGE);
  const overviewQuery = useDashboardOverviewQuery(range);

  return {
    range,
    setRange,
    overviewQuery,
  };
};
