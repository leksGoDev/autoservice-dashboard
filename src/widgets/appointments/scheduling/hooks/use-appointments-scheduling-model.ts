import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { useAppointmentsListQuery } from "@/entities/appointment/api/queries";
import type { AppointmentListItem } from "@/entities/appointment/model/types";
import { useMechanicsRegistryQuery } from "@/entities/mechanic/api/queries";
import { DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from "@/shared/api/constants";
import type { ListResponse } from "@/shared/api/types";
import { applySearchParamsPatch, readPositiveNumberParam } from "@/shared/lib/search-params";
import type { UseQueryResult } from "@tanstack/react-query";
import { isAppointmentsFilterStatus } from "@/widgets/appointments/model/options";
import type {
  AppointmentsGroup,
  AppointmentsToolbarFilters,
  AppointmentGroupKey,
} from "@/widgets/appointments/model/types";

const PAGE_SIZE = DEFAULT_LIST_PAGE_SIZE;

export type AppointmentsSchedulingModel = {
  filters: AppointmentsToolbarFilters;
  listQuery: UseQueryResult<ListResponse<AppointmentListItem>, Error>;
  mechanics: string[];
  groups: AppointmentsGroup[];
  page: number;
  total: number;
  totalPages: number;
  onToolbarChange: (next: Partial<AppointmentsToolbarFilters>) => void;
  onResetFilters: () => void;
  onPageChange: (nextPage: number) => void;
};

function getGroupKey(item: AppointmentListItem): AppointmentGroupKey {
  if (item.status === "cancelled") {
    return "upcoming";
  }

  const now = new Date();
  const appointmentDate = new Date(item.scheduledFor);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);

  if (appointmentDate.getTime() < now.getTime()) {
    return "overdue";
  }

  if (appointmentDate.getTime() >= todayStart.getTime() && appointmentDate.getTime() <= todayEnd.getTime()) {
    return "today";
  }

  return "upcoming";
}

function groupAppointments(items: AppointmentListItem[]): AppointmentsGroup[] {
  const buckets: Record<AppointmentGroupKey, AppointmentListItem[]> = {
    today: [],
    upcoming: [],
    overdue: [],
  };

  items.forEach((item) => {
    buckets[getGroupKey(item)].push(item);
  });

  return [
    { key: "today", items: buckets.today },
    { key: "upcoming", items: buckets.upcoming },
    { key: "overdue", items: buckets.overdue },
  ];
}

export function useAppointmentsSchedulingModel(): AppointmentsSchedulingModel {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = readPositiveNumberParam(searchParams.get("page"), DEFAULT_LIST_PAGE);
  const statusParam = searchParams.get("status") ?? "";
  const filters: AppointmentsToolbarFilters = {
    search: searchParams.get("search") ?? "",
    status: isAppointmentsFilterStatus(statusParam) ? statusParam : "",
    mechanic: searchParams.get("mechanic") ?? "",
    scheduledFrom: searchParams.get("scheduledFrom") ?? "",
    scheduledTo: searchParams.get("scheduledTo") ?? "",
  };

  const listQuery = useAppointmentsListQuery({
    page,
    pageSize: PAGE_SIZE,
    search: filters.search || undefined,
    status: filters.status || undefined,
    assignedMechanic: filters.mechanic || undefined,
    scheduledFrom: filters.scheduledFrom || undefined,
    scheduledTo: filters.scheduledTo || undefined,
  });

  const mechanicsQuery = useMechanicsRegistryQuery({
    page: 1,
    pageSize: 100,
  });

  const mechanics = useMemo(() => {
    const uniqueMechanics = new Set((mechanicsQuery.data?.items ?? []).map((item) => item.name));
    return [...uniqueMechanics].sort((a, b) => a.localeCompare(b));
  }, [mechanicsQuery.data?.items]);

  const rows = listQuery.data?.items ?? [];
  const groups = useMemo(() => groupAppointments(rows), [rows]);
  const total = listQuery.data?.total ?? 0;
  const totalPages = listQuery.data?.totalPages ?? 1;
  const safePage = Math.min(listQuery.data?.page ?? page, totalPages);

  const updateSearchParams = (next: Record<string, string>) => {
    setSearchParams(applySearchParamsPatch(searchParams, next));
  };

  const handleToolbarChange = (next: Partial<AppointmentsToolbarFilters>) => {
    updateSearchParams({
      search: next.search ?? filters.search,
      status: next.status ?? filters.status,
      mechanic: next.mechanic ?? filters.mechanic,
      scheduledFrom: next.scheduledFrom ?? filters.scheduledFrom,
      scheduledTo: next.scheduledTo ?? filters.scheduledTo,
      page: "1",
    });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (nextPage: number) => {
    updateSearchParams({
      search: filters.search,
      status: filters.status,
      mechanic: filters.mechanic,
      scheduledFrom: filters.scheduledFrom,
      scheduledTo: filters.scheduledTo,
      page: String(nextPage),
    });
  };

  return {
    filters,
    listQuery,
    mechanics,
    groups,
    page: safePage,
    total,
    totalPages,
    onToolbarChange: handleToolbarChange,
    onResetFilters: handleResetFilters,
    onPageChange: handlePageChange,
  };
}
