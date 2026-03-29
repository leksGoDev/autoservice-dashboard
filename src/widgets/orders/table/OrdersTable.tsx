import type { ReactNode } from "react";
import { useMemo } from "react";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useI18n } from "@/shared/i18n/use-i18n";
import { PaginationShell } from "@/shared/ui/PaginationShell";
import type { OrdersTableRow } from "@/widgets/orders/model/types";
import { createOrdersTableColumns } from "./model/columns";

type OrdersTableProps = {
  items: OrdersTableRow[];
  page: number;
  totalPages: number;
  total: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  renderStatusCell?: (order: OrdersTableRow) => ReactNode;
  renderMechanicCell?: (order: OrdersTableRow) => ReactNode;
  renderRowActions?: (order: OrdersTableRow) => ReactNode;
};

export const OrdersTable = ({
  items,
  page,
  totalPages,
  total,
  isFetching,
  onPageChange,
  renderStatusCell,
  renderMechanicCell,
  renderRowActions,
}: OrdersTableProps) => {
  const { t } = useI18n();
  const columns = useMemo(
    () =>
      createOrdersTableColumns(t, {
        renderStatusCell,
        renderMechanicCell,
        renderRowActions,
      }),
    [renderMechanicCell, renderRowActions, renderStatusCell, t],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-[14px] pb-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] border-collapse text-[13px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left align-middle text-xs font-semibold text-[var(--color-text-secondary)]"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#20283a]">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left align-middle"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationShell
        summary={`${t("pages.orders.table.pagination.total", { total })}${isFetching ? ` · ${t("pages.orders.table.pagination.updating")}` : ""}`}
        pageLabel={t("pages.orders.table.pagination.page", { page, totalPages })}
        prevLabel={t("pages.orders.table.pagination.prev")}
        nextLabel={t("pages.orders.table.pagination.next")}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrev={() => onPageChange(page - 1)}
        onNext={() => onPageChange(page + 1)}
      />
    </section>
  );
};
