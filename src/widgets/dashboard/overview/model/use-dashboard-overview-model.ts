import { useState } from "react";
import type { UseQueryResult } from "@tanstack/react-query";

import { useDashboardOverviewQuery } from "@/entities/dashboard/api/queries";
import type { DashboardOverview, DashboardRange } from "@/entities/dashboard/model/types";
import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";

export type DashboardOverviewModel = {
  range: DashboardRange;
  setRange: (range: DashboardRange) => void;
  overviewQuery: UseQueryResult<DashboardOverview, Error>;
};

export const useDashboardOverviewModel = (): DashboardOverviewModel => {
  const [range, setRange] = useState<DashboardRange>(DEFAULT_DASHBOARD_RANGE);
  const overviewQuery = useDashboardOverviewQuery(range);

  return {
    range,
    setRange,
    overviewQuery,
  };
};
