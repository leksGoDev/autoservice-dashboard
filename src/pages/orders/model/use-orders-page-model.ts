import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { useOrdersListQuery } from "@/entities/order/api/queries";
import type { OrderListItem, OrderStatus } from "@/entities/order/model/types";
import { DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from "@/shared/api/constants";
import type { OrdersTableRow, OrdersToolbarFilters, UiOrderPriority } from "@/widgets/orders-shared/model/types";

const PAGE_SIZE = DEFAULT_LIST_PAGE_SIZE;
const MECHANICS = ["Ivan Petrov", "Nikolai Volkov", "Sergey Morozov", "Andrey Sokolov"] as const;

function readPositiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getPriority(totalAmount: number): UiOrderPriority {
  if (totalAmount >= 900) {
    return "high";
  }

  if (totalAmount >= 500) {
    return "medium";
  }

  return "low";
}

function enrichOrder(item: OrderListItem): OrdersTableRow {
  const mechanicIndex = Number(item.id.replace(/\D/g, "")) % MECHANICS.length;

  return {
    id: item.id,
    number: item.number,
    customerName: item.customerName,
    vehicleLabel: item.vehicleLabel,
    status: item.status,
    priority: getPriority(item.totalAmount),
    assignedMechanic: MECHANICS[mechanicIndex],
    jobsCount: Math.max(1, Math.round(item.totalAmount / 260)),
    totalAmount: item.totalAmount,
    createdAt: item.createdAt,
  };
}

function isInsideDateRange(itemDateIso: string, from: string, to: string) {
  const timestamp = new Date(itemDateIso).getTime();

  if (from) {
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);

    if (timestamp < fromDate.getTime()) {
      return false;
    }
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    if (timestamp > toDate.getTime()) {
      return false;
    }
  }

  return true;
}

export function useOrdersPageModel() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = readPositiveNumber(searchParams.get("page"), DEFAULT_LIST_PAGE);
  const filters: OrdersToolbarFilters = {
    search: searchParams.get("search") ?? "",
    status: (searchParams.get("status") as OrderStatus | "") ?? "",
    priority: (searchParams.get("priority") as UiOrderPriority | "") ?? "",
    mechanic: searchParams.get("mechanic") ?? "",
    createdFrom: searchParams.get("createdFrom") ?? "",
    createdTo: searchParams.get("createdTo") ?? "",
  };

  const listQuery = useOrdersListQuery({
    page: 1,
    pageSize: 100,
    search: filters.search || undefined,
    status: filters.status || undefined,
  });

  const allRows = useMemo(() => (listQuery.data?.items ?? []).map(enrichOrder), [listQuery.data?.items]);

  const mechanics = useMemo(() => {
    const uniqueMechanics = new Set(allRows.map((item) => item.assignedMechanic));
    return [...uniqueMechanics].sort((a, b) => a.localeCompare(b));
  }, [allRows]);

  const filteredRows = useMemo(
    () =>
      allRows.filter((item) => {
        if (filters.priority && item.priority !== filters.priority) {
          return false;
        }

        if (filters.mechanic && item.assignedMechanic !== filters.mechanic) {
          return false;
        }

        return isInsideDateRange(item.createdAt, filters.createdFrom, filters.createdTo);
      }),
    [allRows, filters.createdFrom, filters.createdTo, filters.mechanic, filters.priority],
  );

  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * PAGE_SIZE;
  const paginatedRows = filteredRows.slice(offset, offset + PAGE_SIZE);

  const updateSearchParams = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(next).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });

    setSearchParams(params);
  };

  const handleToolbarChange = (next: Partial<OrdersToolbarFilters>) => {
    updateSearchParams({
      search: next.search ?? filters.search,
      status: next.status ?? filters.status,
      priority: next.priority ?? filters.priority,
      mechanic: next.mechanic ?? filters.mechanic,
      createdFrom: next.createdFrom ?? filters.createdFrom,
      createdTo: next.createdTo ?? filters.createdTo,
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
      priority: filters.priority,
      mechanic: filters.mechanic,
      createdFrom: filters.createdFrom,
      createdTo: filters.createdTo,
      page: String(nextPage),
    });
  };

  return {
    filters,
    listQuery,
    mechanics,
    rows: paginatedRows,
    page: safePage,
    total,
    totalPages,
    onToolbarChange: handleToolbarChange,
    onResetFilters: handleResetFilters,
    onPageChange: handlePageChange,
  };
}
