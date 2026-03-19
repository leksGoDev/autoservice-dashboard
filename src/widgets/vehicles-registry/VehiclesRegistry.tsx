import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useVehiclesListQuery } from "@/entities/vehicle/api/queries";
import type { VehicleListItem } from "@/entities/vehicle/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { PaginationShell } from "@/shared/ui/PaginationShell";

const PAGE_SIZE = 10;

type VehiclesToolbarProps = {
  hasActiveSearch: boolean;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;
};

const VehiclesToolbar = ({
  hasActiveSearch,
  searchInput,
  onSearchInputChange,
  onSubmit,
  onClearSearch,
}: VehiclesToolbarProps) => {
  const { t } = useI18n();

  return (
    <form className="mt-2 grid items-end gap-[10px] md:grid-cols-[minmax(260px,1fr)_auto_auto]" onSubmit={onSubmit}>
      <label htmlFor="vehicles-search" className="text-[12px] font-semibold text-[var(--color-text-secondary)] md:col-span-full">
        {t("pages.vehicles.searchLabel")}
      </label>
      <input
        id="vehicles-search"
        className="w-full rounded-xl border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-3 py-2.5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
        value={searchInput}
        onChange={(event) => onSearchInputChange(event.target.value)}
        placeholder={t("pages.vehicles.searchPlaceholder")}
      />
      <button
        type="submit"
        className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.2)] px-3 py-2.5 text-[13px] font-semibold text-[var(--color-text-primary)]"
      >
        {t("pages.vehicles.searchButton")}
      </button>
      {hasActiveSearch ? (
        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-3 py-2.5 text-[13px] font-semibold text-[var(--color-text-secondary)]"
          onClick={onClearSearch}
        >
          {t("pages.vehicles.clearSearch")}
        </button>
      ) : null}
    </form>
  );
};

const VehiclesLoadingState = () => {
  const { t } = useI18n();

  return (
    <section
      className="rounded-2xl border border-[rgba(154,164,178,0.18)] bg-[rgba(27,33,48,0.9)] px-[18px] py-[18px] text-[var(--color-text-secondary)]"
      aria-live="polite"
    >
      <div className="grid gap-[10px]">
        <span>{t("pages.vehicles.loading")}</span>
        <div className="grid gap-2" role="presentation" aria-hidden>
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className="block h-[10px] animate-pulse rounded-full bg-[rgba(154,164,178,0.2)]" />
        ))}
        </div>
      </div>
    </section>
  );
};

type VehiclesErrorStateProps = {
  onRetry: () => void;
};

const VehiclesErrorState = ({ onRetry }: VehiclesErrorStateProps) => {
  const { t } = useI18n();

  return (
    <DataState
      tone="error"
      message={t("pages.vehicles.error")}
      action={
        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
          onClick={onRetry}
        >
          {t("common.retry")}
        </button>
      }
    />
  );
};

type VehiclesEmptyStateProps = {
  hasActiveSearch: boolean;
};

const VehiclesEmptyState = ({ hasActiveSearch }: VehiclesEmptyStateProps) => {
  const { t } = useI18n();

  return (
    <section
      className="grid gap-[10px] rounded-2xl border border-[rgba(154,164,178,0.18)] bg-[rgba(27,33,48,0.9)] px-[18px] py-[18px] text-[var(--color-text-secondary)]"
      aria-live="polite"
    >
      <strong>{hasActiveSearch ? t("pages.vehicles.emptySearch") : t("pages.vehicles.empty")}</strong>
      <span>{t("pages.vehicles.emptyHint")}</span>
    </section>
  );
};

type VehiclesTableProps = {
  data: VehicleListItem[];
  summary: string;
  page: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

const VehiclesTable = ({
  data,
  summary,
  page,
  totalPages,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: VehiclesTableProps) => {
  const { t } = useI18n();

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<VehicleListItem>();

    return [
      columnHelper.accessor("plateNumber", {
        header: t("pages.vehicles.columns.plateNumber"),
        cell: (info) => (
          <span className="font-mono text-[13px] text-[#c9d1dd]">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("vin", {
        header: t("pages.vehicles.columns.vin"),
        cell: (info) => (
          <span className="font-mono text-[13px] text-[#c9d1dd]">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("make", {
        header: t("pages.vehicles.columns.make"),
      }),
      columnHelper.accessor("model", {
        header: t("pages.vehicles.columns.model"),
      }),
      columnHelper.accessor("year", {
        header: t("pages.vehicles.columns.year"),
      }),
      columnHelper.accessor("owner", {
        header: t("pages.vehicles.columns.owner"),
      }),
      columnHelper.accessor("ordersCount", {
        header: t("pages.vehicles.columns.ordersCount"),
      }),
      columnHelper.display({
        id: "serviceHistory",
        header: t("pages.vehicles.columns.serviceHistory"),
        cell: (info) => (
          <Link
            to={`/vehicles/${info.row.original.id}`}
            className="inline-flex rounded-full border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.14)] px-2.5 py-1.5 text-[12px] font-semibold text-[var(--color-accent-light-blue)] transition-colors hover:bg-[rgba(107,164,255,0.2)]"
          >
            {t("pages.vehicles.actions.serviceHistory")}
          </Link>
        ),
      }),
    ];
  }, [t]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="grid gap-[14px] rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-[14px]">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full border-collapse text-left text-[13px] max-[900px]:min-w-[760px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-[#20283a]">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationShell
        summary={summary}
        pageLabel={t("pages.vehicles.pagination", { page, totalPages })}
        prevLabel={t("pages.vehicles.actions.prev")}
        nextLabel={t("pages.vehicles.actions.next")}
        canGoPrev={canPrev}
        canGoNext={canNext}
        onPrev={onPrev}
        onNext={onNext}
      />
    </section>
  );
};

export const VehiclesRegistry = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const vehiclesQuery = useVehiclesListQuery({ page, pageSize: PAGE_SIZE, search });
  const data = vehiclesQuery.data;

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

  return (
    <section className="grid gap-5">
      <header className="grid gap-[10px] rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
        <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
          {t("pages.vehicles.eyebrow")}
        </span>
        <h1 className="m-0 text-[28px] leading-[1.15]">{t("pages.vehicles.title")}</h1>
        <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.vehicles.description")}</p>

        <VehiclesToolbar
          hasActiveSearch={hasActiveSearch}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSubmit={handleSearchSubmit}
          onClearSearch={handleClearSearch}
        />
      </header>

      {vehiclesQuery.isLoading ? <VehiclesLoadingState /> : null}

      {vehiclesQuery.isError ? <VehiclesErrorState onRetry={() => vehiclesQuery.refetch()} /> : null}

      {!vehiclesQuery.isLoading && !vehiclesQuery.isError && !hasRows ? (
        <VehiclesEmptyState hasActiveSearch={hasActiveSearch} />
      ) : null}

      {!vehiclesQuery.isLoading && !vehiclesQuery.isError && hasRows && data ? (
        <VehiclesTable
          data={data.items}
          summary={summary}
          page={data.page}
          totalPages={data.totalPages}
          canPrev={data.page > 1 && !vehiclesQuery.isFetching}
          canNext={data.page < data.totalPages && !vehiclesQuery.isFetching}
          onPrev={() => setPage((value) => Math.max(1, value - 1))}
          onNext={() => setPage((value) => value + 1)}
        />
      ) : null}
    </section>
  );
};
