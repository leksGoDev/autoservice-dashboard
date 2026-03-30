import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";

import type { MechanicRegistryItem, MechanicStatus } from "@/entities/mechanic/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { tableBodyCellClassName, tableHeaderCellClassName } from "@/shared/ui/class-names";
import { PaginationShell } from "@/shared/ui/PaginationShell";
import { WidgetCard } from "@/shared/ui/WidgetCard";

type MechanicsRegistryTableProps = {
  rows: MechanicRegistryItem[];
  page: number;
  totalPages: number;
  summary: string;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

const STATUS_CLASS_MAP: Record<MechanicStatus, string> = {
  available: "bg-[rgba(34,197,94,0.2)] text-[#bbf7d0]",
  busy: "bg-[rgba(245,158,11,0.2)] text-[#fde68a]",
  off_shift: "bg-[rgba(154,164,178,0.2)] text-[#d8dee9]",
};

function getStatusKey(status: MechanicStatus) {
  const map: Record<MechanicStatus, string> = {
    available: "pages.mechanics.status.available",
    busy: "pages.mechanics.status.busy",
    off_shift: "pages.mechanics.status.offShift",
  };

  return map[status];
}

export const MechanicsRegistryTable = ({
  rows,
  page,
  totalPages,
  summary,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: MechanicsRegistryTableProps) => {
  const { t } = useI18n();

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<MechanicRegistryItem>();

    return [
      columnHelper.accessor("name", {
        header: t("pages.mechanics.table.columns.name"),
      }),
      columnHelper.accessor("specialization", {
        header: t("pages.mechanics.table.columns.specialization"),
      }),
      columnHelper.accessor("activeJobs", {
        header: t("pages.mechanics.table.columns.activeJobs"),
      }),
      columnHelper.accessor("status", {
        header: t("pages.mechanics.table.columns.status"),
        cell: (info) => {
          const status = info.getValue();

          return (
            <span
              className={[
                "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
                STATUS_CLASS_MAP[status],
              ].join(" ")}
            >
              {t(getStatusKey(status))}
            </span>
          );
        },
      }),
      columnHelper.accessor("experienceYears", {
        header: t("pages.mechanics.table.columns.experienceYears"),
        cell: (info) => t("pages.mechanics.table.experienceYears", { years: info.getValue() }),
      }),
    ];
  }, [t]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <WidgetCard
      title={t("pages.mechanics.table.title")}
      description={t("pages.mechanics.table.description")}
      className="grid gap-4"
    >
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left text-[13px]">
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
        pageLabel={t("pages.mechanics.table.page", { page, totalPages })}
        prevLabel={t("pages.mechanics.table.prev")}
        nextLabel={t("pages.mechanics.table.next")}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrev={onPrev}
        onNext={onNext}
      />
    </WidgetCard>
  );
};
