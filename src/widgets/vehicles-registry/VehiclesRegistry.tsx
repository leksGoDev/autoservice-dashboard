import "./vehicles-registry.css";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { FC, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useVehiclesListQuery } from "@/entities/vehicle/api/queries";
import type { VehicleListItem } from "@/entities/vehicle/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";

const PAGE_SIZE = 10;

interface VehiclesToolbarProps {
  hasActiveSearch: boolean;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;
}

const VehiclesToolbar: FC<VehiclesToolbarProps> = ({
  hasActiveSearch,
  searchInput,
  onSearchInputChange,
  onSubmit,
  onClearSearch,
}) => {
  const { t } = useI18n();

  return (
    <form className="vehicles-toolbar" onSubmit={onSubmit}>
      <label htmlFor="vehicles-search" className="vehicles-toolbar__label">
        {t("pages.vehicles.searchLabel")}
      </label>
      <input
        id="vehicles-search"
        className="vehicles-toolbar__search"
        value={searchInput}
        onChange={(event) => onSearchInputChange(event.target.value)}
        placeholder={t("pages.vehicles.searchPlaceholder")}
      />
      <button type="submit" className="vehicles-toolbar__button">
        {t("pages.vehicles.searchButton")}
      </button>
      {hasActiveSearch ? (
        <button type="button" className="vehicles-toolbar__button vehicles-toolbar__button--ghost" onClick={onClearSearch}>
          {t("pages.vehicles.clearSearch")}
        </button>
      ) : null}
    </form>
  );
};

const VehiclesLoadingState: FC = () => {
  const { t } = useI18n();

  return (
    <section className="vehicles-state" aria-live="polite">
      <span>{t("pages.vehicles.loading")}</span>
      <div className="vehicles-skeleton" role="presentation" aria-hidden>
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className="vehicles-skeleton__line" />
        ))}
      </div>
    </section>
  );
};

interface VehiclesErrorStateProps {
  onRetry: () => void;
}

const VehiclesErrorState: FC<VehiclesErrorStateProps> = ({ onRetry }) => {
  const { t } = useI18n();

  return (
    <section className="vehicles-state vehicles-state--error" aria-live="polite">
      <span>{t("pages.vehicles.error")}</span>
      <button type="button" className="vehicles-state__retry" onClick={onRetry}>
        {t("common.retry")}
      </button>
    </section>
  );
};

interface VehiclesEmptyStateProps {
  hasActiveSearch: boolean;
}

const VehiclesEmptyState: FC<VehiclesEmptyStateProps> = ({ hasActiveSearch }) => {
  const { t } = useI18n();

  return (
    <section className="vehicles-state" aria-live="polite">
      <strong>{hasActiveSearch ? t("pages.vehicles.emptySearch") : t("pages.vehicles.empty")}</strong>
      <span>{t("pages.vehicles.emptyHint")}</span>
    </section>
  );
};

interface VehiclesTableProps {
  data: VehicleListItem[];
  summary: string;
  page: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const VehiclesTable: FC<VehiclesTableProps> = ({
  data,
  summary,
  page,
  totalPages,
  canPrev,
  canNext,
  onPrev,
  onNext,
}) => {
  const { t } = useI18n();

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<VehicleListItem>();

    return [
      columnHelper.accessor("plateNumber", {
        header: t("pages.vehicles.columns.plateNumber"),
        cell: (info) => <span className="vehicles-table__mono">{info.getValue()}</span>,
      }),
      columnHelper.accessor("vin", {
        header: t("pages.vehicles.columns.vin"),
        cell: (info) => <span className="vehicles-table__mono">{info.getValue()}</span>,
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
          <Link to={`/vehicles/${info.row.original.id}`} className="vehicles-table__action">
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
    <section className="vehicles-registry">
      <div className="vehicles-registry__table-wrap">
        <table className="vehicles-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="vehicles-registry__footer">
        <span className="vehicles-registry__summary">{summary}</span>
        <div className="vehicles-pagination">
          <button type="button" className="vehicles-pagination__button" disabled={!canPrev} onClick={onPrev}>
            {t("pages.vehicles.actions.prev")}
          </button>
          <span className="vehicles-pagination__status">
            {t("pages.vehicles.pagination", { page, totalPages })}
          </span>
          <button type="button" className="vehicles-pagination__button" disabled={!canNext} onClick={onNext}>
            {t("pages.vehicles.actions.next")}
          </button>
        </div>
      </footer>
    </section>
  );
};

export const VehiclesRegistry: FC = () => {
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
    <section className="vehicles-page">
      <header className="vehicles-page__hero">
        <span className="vehicles-page__eyebrow">{t("pages.vehicles.eyebrow")}</span>
        <h1 className="vehicles-page__title">{t("pages.vehicles.title")}</h1>
        <p className="vehicles-page__description">{t("pages.vehicles.description")}</p>

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
