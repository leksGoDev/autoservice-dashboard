import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { UseQueryResult } from "@tanstack/react-query";

import type { CustomerListItem } from "@/entities/customer/model/types";
import type { ListResponse } from "@/shared/api/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { useCustomersRegistryQuery } from "../useCustomersRegistryQuery";

export type CustomersRegistryModel = {
  search: string;
  setSearch: (value: string) => void;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  query: UseQueryResult<ListResponse<CustomerListItem>, Error>;
  data: ListResponse<CustomerListItem> | undefined;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  summary: string;
  pageLabel: string;
  handleSearchChange: (value: string) => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
};

export const useCustomersRegistryModel = (): CustomersRegistryModel => {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const query = useCustomersRegistryQuery({ page, search });
  const data = query.data;
  const isLoading = query.isLoading || query.isFetching;
  const isError = query.isError;
  const isEmpty = !isLoading && !isError && (data?.items.length ?? 0) === 0;

  const summary = useMemo(() => {
    if (!data || !data.total) {
      return t("customersRegistry.pagination.empty");
    }

    const start = (data.page - 1) * data.pageSize + 1;
    const end = Math.min(data.page * data.pageSize, data.total);

    return t("customersRegistry.pagination.summary", { start, end, total: data.total });
  }, [data, t]);

  const pageLabel = t("customersRegistry.pagination.pageOf", {
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
  });

  return {
    search,
    setSearch,
    page,
    setPage,
    query,
    data,
    isLoading,
    isError,
    isEmpty,
    summary,
    pageLabel,
    handleSearchChange: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    handlePrevPage: () => {
      setPage((prev) => Math.max(1, prev - 1));
    },
    handleNextPage: () => {
      setPage((prev) => prev + 1);
    },
  };
};
