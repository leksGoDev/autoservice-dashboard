import "./customers-registry.css";

import { useMemo, useState, type FC } from "react";

import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { PaginationShell } from "@/shared/ui/PaginationShell";
import { WidgetCard } from "@/shared/ui/WidgetCard";

import { CustomersRegistrySearch } from "./CustomersRegistrySearch";
import { CustomersRegistryTable } from "./CustomersRegistryTable";
import { useCustomersRegistryQuery } from "./useCustomersRegistryQuery";

export const CustomersRegistry: FC = () => {
  const { t, locale } = useI18n();
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

  return (
    <WidgetCard
      title={t("customersRegistry.title")}
      description={t("customersRegistry.description")}
      className="customers-registry"
    >
      <CustomersRegistrySearch
        value={search}
        placeholder={t("customersRegistry.searchPlaceholder")}
        ariaLabel={t("customersRegistry.searchAria")}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
      />

      {isLoading ? <DataState message={t("customersRegistry.states.loading")} /> : null}

      {isError ? (
        <DataState
          tone="error"
          message={t("customersRegistry.states.error")}
          action={
            <button type="button" className="customers-registry__retry" onClick={() => query.refetch()}>
              {t("common.retry")}
            </button>
          }
        />
      ) : null}

      {isEmpty ? <DataState message={t("customersRegistry.states.empty")} /> : null}

      {!isLoading && !isError && !isEmpty && data ? (
        <>
          <CustomersRegistryTable
            rows={data.items}
            locale={locale}
            unknownLabel={t("common.unknown")}
            detailsLabel={t("customersRegistry.detailsLink")}
            headers={{
              name: t("customersRegistry.table.name"),
              phone: t("customersRegistry.table.phone"),
              email: t("customersRegistry.table.email"),
              vehiclesCount: t("customersRegistry.table.vehiclesCount"),
              ordersCount: t("customersRegistry.table.ordersCount"),
              lastVisit: t("customersRegistry.table.lastVisit"),
            }}
          />

          <PaginationShell
            summary={summary}
            pageLabel={pageLabel}
            prevLabel={t("customersRegistry.pagination.previous")}
            nextLabel={t("customersRegistry.pagination.next")}
            canGoPrev={Boolean(data.page > 1)}
            canGoNext={Boolean(data.page < data.totalPages)}
            onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setPage((prev) => prev + 1)}
          />
        </>
      ) : null}
    </WidgetCard>
  );
};
