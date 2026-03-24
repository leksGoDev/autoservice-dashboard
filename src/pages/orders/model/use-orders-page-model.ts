import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { useMechanicsRegistryQuery } from "@/entities/mechanic/api/queries";
import { useOrdersListQuery } from "@/entities/order/api/queries";
import type { OrderStatus } from "@/entities/order/model/types";
import { DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from "@/shared/api/constants";
import type { OrdersToolbarFilters } from "@/widgets/orders-shared/model/types";

const PAGE_SIZE = DEFAULT_LIST_PAGE_SIZE;

function readPositiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function useOrdersPageModel() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = readPositiveNumber(searchParams.get("page"), DEFAULT_LIST_PAGE);
  const priorityParam = searchParams.get("priority");
  const filters: OrdersToolbarFilters = {
    search: searchParams.get("search") ?? "",
    status: (searchParams.get("status") as OrderStatus | "") ?? "",
    priority: priorityParam ? (priorityParam as OrdersToolbarFilters["priority"]) : "",
    mechanic: searchParams.get("mechanic") ?? "",
    createdFrom: searchParams.get("createdFrom") ?? "",
    createdTo: searchParams.get("createdTo") ?? "",
  };

  const listQuery = useOrdersListQuery({
    page,
    pageSize: PAGE_SIZE,
    search: filters.search || undefined,
    status: filters.status || undefined,
    priority: filters.priority || undefined,
    assignedMechanic: filters.mechanic || undefined,
    createdFrom: filters.createdFrom || undefined,
    createdTo: filters.createdTo || undefined,
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
  const total = listQuery.data?.total ?? 0;
  const totalPages = listQuery.data?.totalPages ?? 1;
  const safePage = Math.min(listQuery.data?.page ?? page, totalPages);

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
    rows,
    page: safePage,
    total,
    totalPages,
    onToolbarChange: handleToolbarChange,
    onResetFilters: handleResetFilters,
    onPageChange: handlePageChange,
  };
}
