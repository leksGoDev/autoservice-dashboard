import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { useMechanicsRegistryQuery, useMechanicsWorkloadQuery } from "@/entities/mechanic/api/queries";
import { DASHBOARD_RANGES, DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { useI18n } from "@/shared/i18n/use-i18n";

const PAGE_SIZE = 10;

type AvailabilityCounts = {
  available: number;
  busy: number;
  off_shift: number;
};

export const useMechanicsRegistryModel = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [range, setRange] = useState<typeof DASHBOARD_RANGES[number]>(DEFAULT_DASHBOARD_RANGE);

  const registryQuery = useMechanicsRegistryQuery({ page, pageSize: PAGE_SIZE, search });
  const workloadQuery = useMechanicsWorkloadQuery(range);

  const data = registryQuery.data;
  const rows = data?.items ?? [];

  const availability = useMemo(() => {
    const counts = rows.reduce<AvailabilityCounts>(
      (acc, item) => {
        acc[item.status] += 1;
        return acc;
      },
      { available: 0, busy: 0, off_shift: 0 },
    );

    const workload = workloadQuery.data ?? [];
    const averageUtilization =
      workload.length > 0
        ? Math.round(workload.reduce((sum, item) => sum + item.utilization, 0) / workload.length)
        : 0;

    return {
      counts,
      averageUtilization,
    };
  }, [rows, workloadQuery.data]);

  const assignmentLeaders = useMemo(() => {
    const workload = workloadQuery.data ?? [];

    return [...workload]
      .sort((left, right) => right.assignedOrders - left.assignedOrders)
      .slice(0, 3);
  }, [workloadQuery.data]);

  const summary = useMemo(() => {
    if (!data || data.total === 0) {
      return t("pages.mechanics.table.summaryEmpty");
    }

    const start = (data.page - 1) * data.pageSize + 1;
    const end = start + data.items.length - 1;

    return t("pages.mechanics.table.summary", {
      start,
      end,
      total: data.total,
    });
  }, [data, t]);

  const canGoPrev = Boolean(data && data.page > 1 && !registryQuery.isFetching);
  const canGoNext = Boolean(data && data.page < data.totalPages && !registryQuery.isFetching);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleRetry() {
    void registryQuery.refetch();
    void workloadQuery.refetch();
  }

  return {
    range,
    setRange,
    searchInput,
    setSearchInput,
    page,
    setPage,
    registryQuery,
    workloadQuery,
    data,
    rows,
    availability,
    assignmentLeaders,
    summary,
    canGoPrev,
    canGoNext,
    handleSearchSubmit,
    handleRetry,
  };
};
