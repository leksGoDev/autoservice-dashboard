import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import type { VehicleListItem } from "@/entities/vehicle/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { tableBodyCellClassName, tableHeaderCellClassName } from "@/shared/ui/class-names";
import { PaginationShell } from "@/shared/ui/PaginationShell";

type VehiclesRegistryTableProps = {
  data: VehicleListItem[];
  summary: string;
  page: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export const VehiclesRegistryTable = ({
  data,
  summary,
  page,
  totalPages,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: VehiclesRegistryTableProps) => {
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
            className="inline-flex rounded-full border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.14)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-accent-light-blue)] transition-colors hover:bg-[rgba(107,164,255,0.2)]"
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
    <section className="grid gap-3.5 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-3.5">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full border-collapse text-left text-[13px] max-[900px]:min-w-[760px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={tableHeaderCellClassName}
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
                  <td key={cell.id} className={tableBodyCellClassName}>
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
