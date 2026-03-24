import { useEffect, useMemo, useState, type FormEvent } from "react";

import { useVehiclesListQuery } from "@/entities/vehicle/api/queries";
import { useI18n } from "@/shared/i18n/use-i18n";

const PAGE_SIZE = 10;

export function useVehiclesRegistryModel() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const query = useVehiclesListQuery({ page, pageSize: PAGE_SIZE, search });
  const data = query.data;

  useEffect(() => {
    if (data && page > data.totalPages) {
      setPage(data.totalPages);
    }
  }, [data, page]);

  const hasActiveSearch = search.length > 0;
  const hasRows = (data?.items.length ?? 0) > 0;

  const summary = useMemo(() => {
    if (!data || data.total === 0) {
      return t("pages.vehicles.summaryEmpty");
    }

    const start = (data.page - 1) * data.pageSize + 1;
    const end = start + data.items.length - 1;

    return t("pages.vehicles.summary", { start, end, total: data.total });
  }, [data, t]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  return {
    query,
    data,
    hasActiveSearch,
    hasRows,
    summary,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    handleClearSearch,
    setPage,
  };
}
