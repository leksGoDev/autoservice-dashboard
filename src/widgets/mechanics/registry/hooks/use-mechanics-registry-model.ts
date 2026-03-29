import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import type { ListResponse } from "@/shared/api/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useMechanicsRegistryQuery, useMechanicsWorkloadQuery } from "@/entities/mechanic/api/queries";
import type { MechanicRegistryItem, MechanicWorkloadItem } from "@/entities/mechanic/model/types";
import { DASHBOARD_RANGES, DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { useI18n } from "@/shared/i18n/use-i18n";

const PAGE_SIZE = 10;

type AvailabilityCounts = {
  available: number;
  busy: number;
  off_shift: number;
};

export type MechanicsRegistryModel = {
  range: typeof DASHBOARD_RANGES[number];
  setRange: (next: typeof DASHBOARD_RANGES[number]) => void;
  searchInput: string;
  setSearchInput: (next: string) => void;
  page: number;
  listQuery: UseQueryResult<ListResponse<MechanicRegistryItem>, Error>;
  workloadQuery: UseQueryResult<MechanicWorkloadItem[], Error>;
  listData: ListResponse<MechanicRegistryItem> | undefined;
  rows: MechanicRegistryItem[];
  workloadItems: MechanicWorkloadItem[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  availability: {
    counts: AvailabilityCounts;
    averageUtilization: number;
  };
  assignmentLeaders: MechanicWorkloadItem[];
  summary: string;
  canGoPrev: boolean;
  canGoNext: boolean;
  handleSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleRetry: () => void;
};

export const useMechanicsRegistryModel = (): MechanicsRegistryModel => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [range, setRange] = useState<typeof DASHBOARD_RANGES[number]>(DEFAULT_DASHBOARD_RANGE);

  const listQuery = useMechanicsRegistryQuery({ page, pageSize: PAGE_SIZE, search });
  const workloadQuery = useMechanicsWorkloadQuery(range);

  const listData = listQuery.data;
  const rows = listData?.items ?? [];
  const workloadItems = workloadQuery.data ?? [];
  const isLoading = listQuery.isLoading || workloadQuery.isLoading;
  const isError = listQuery.isError || workloadQuery.isError;
  const isEmpty = !isLoading && !isError && rows.length === 0;

  const availability = useMemo(() => {
    const counts = rows.reduce<AvailabilityCounts>(
      (acc, item) => {
        acc[item.status] += 1;
        return acc;
      },
      { available: 0, busy: 0, off_shift: 0 },
    );

    const averageUtilization =
      workloadItems.length > 0
        ? Math.round(workloadItems.reduce((sum, item) => sum + item.utilization, 0) / workloadItems.length)
        : 0;

    return {
      counts,
      averageUtilization,
    };
  }, [rows, workloadItems]);

  const assignmentLeaders = useMemo(() => {
    return [...workloadItems]
      .sort((left, right) => right.assignedOrders - left.assignedOrders)
      .slice(0, 3);
  }, [workloadItems]);

  const summary = useMemo(() => {
    if (!listData || listData.total === 0) {
      return t("pages.mechanics.table.summaryEmpty");
    }

    const start = (listData.page - 1) * listData.pageSize + 1;
    const end = start + listData.items.length - 1;

    return t("pages.mechanics.table.summary", {
      start,
      end,
      total: listData.total,
    });
  }, [listData, t]);

  const canGoPrev = Boolean(listData && listData.page > 1 && !listQuery.isFetching);
  const canGoNext = Boolean(listData && listData.page < listData.totalPages && !listQuery.isFetching);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handlePrevPage() {
    setPage((value) => Math.max(1, value - 1));
  }

  function handleNextPage() {
    setPage((value) => value + 1);
  }

  function handleRetry() {
    void listQuery.refetch();
    void workloadQuery.refetch();
  }

  return {
    range,
    setRange,
    searchInput,
    setSearchInput,
    page,
    listQuery,
    workloadQuery,
    listData,
    rows,
    workloadItems,
    isLoading,
    isError,
    isEmpty,
    availability,
    assignmentLeaders,
    summary,
    canGoPrev,
    canGoNext,
    handleSearchSubmit,
    handlePrevPage,
    handleNextPage,
    handleRetry,
  };
};
