import type { FC, ReactNode } from "react";
import { useMemo } from "react";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useI18n } from "@/shared/i18n/use-i18n";
import type { OrdersTableRow } from "@/widgets/orders-shared/model/types";
import { createOrdersTableColumns } from "./model/columns";

interface OrdersTableProps {
  items: OrdersTableRow[];
  page: number;
  totalPages: number;
  total: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  renderRowActions?: (order: OrdersTableRow) => ReactNode;
}

export const OrdersTable: FC<OrdersTableProps> = ({
  items,
  page,
  totalPages,
  total,
  isFetching,
  onPageChange,
  renderRowActions,
}) => {
  const { t } = useI18n();
  const columns = useMemo(() => createOrdersTableColumns(t, renderRowActions), [renderRowActions, t]);

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <section className="orders-table-card">
      <div className="orders-table-wrap">
        <table className="orders-table">
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

      <footer className="orders-table__footer">
        <span className="orders-table__meta">
          {t("pages.orders.table.pagination.total", { total })}
          {isFetching ? ` · ${t("pages.orders.table.pagination.updating")}` : ""}
        </span>

        <div className="orders-table__pagination">
          <button
            type="button"
            className="orders-table__page-button"
            onClick={() => onPageChange(page - 1)}
            disabled={!canGoPrev}
          >
            {t("pages.orders.table.pagination.prev")}
          </button>
          <span className="orders-table__page-label">
            {t("pages.orders.table.pagination.page", { page, totalPages })}
          </span>
          <button
            type="button"
            className="orders-table__page-button"
            onClick={() => onPageChange(page + 1)}
            disabled={!canGoNext}
          >
            {t("pages.orders.table.pagination.next")}
          </button>
        </div>
      </footer>
    </section>
  );
};
