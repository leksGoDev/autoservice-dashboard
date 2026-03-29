import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import type { ColumnDef } from "@tanstack/react-table";

import type { TFunction } from "i18next";

import { getPriorityBadgeClass, getStatusBadgeClass } from "@/shared/ui/status-badges";
import type { OrdersTableRow } from "@/widgets/orders/model/types";
import { formatOrderCurrency, formatOrderDate, getOrderStatusChipModifier } from "./presentation";

type CreateOrdersTableColumnsOptions = {
  renderStatusCell?: (order: OrdersTableRow) => ReactNode;
  renderMechanicCell?: (order: OrdersTableRow) => ReactNode;
  renderRowActions?: (order: OrdersTableRow) => ReactNode;
};

export function createOrdersTableColumns(
  t: TFunction,
  options?: CreateOrdersTableColumnsOptions,
): ColumnDef<OrdersTableRow>[] {
  return [
    {
      accessorKey: "number",
      header: t("pages.orders.table.headers.number"),
      cell: (info) => (
        <Link
          to={`/orders/${info.row.original.id}`}
          className="font-mono text-[13px] text-[#9fc3ff] underline decoration-transparent decoration-1 underline-offset-2 transition-colors hover:text-[#cfe1ff] hover:decoration-current"
        >
          {info.getValue() as string}
        </Link>
      ),
    },
    {
      accessorKey: "customerName",
      header: t("pages.orders.table.headers.customer"),
    },
    {
      accessorKey: "vehicleLabel",
      header: t("pages.orders.table.headers.vehicle"),
    },
    {
      accessorKey: "status",
      header: t("pages.orders.table.headers.status"),
      cell: (info) => {
        if (options?.renderStatusCell) {
          return options.renderStatusCell(info.row.original);
        }

        const status = info.getValue() as OrdersTableRow["status"];
        return (
          <span
            className={[
              "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
              getStatusBadgeClass(getOrderStatusChipModifier(status)),
            ].join(" ").trim()}
          >
            {t(`order.status.${status}`)}
          </span>
        );
      },
    },
    {
      accessorKey: "priority",
      header: t("pages.orders.table.headers.priority"),
      cell: (info) => {
        const priority = info.getValue() as OrdersTableRow["priority"];
        return (
          <span
            className={[
              "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
              getPriorityBadgeClass(priority),
            ].join(" ").trim()}
          >
            {t(`order.priority.${priority}`)}
          </span>
        );
      },
    },
    {
      accessorKey: "assignedMechanic",
      header: t("pages.orders.table.headers.mechanic"),
      cell: (info) =>
        options?.renderMechanicCell ? options.renderMechanicCell(info.row.original) : (info.getValue() as string),
    },
    {
      accessorKey: "jobsCount",
      header: t("pages.orders.table.headers.jobs"),
    },
    {
      accessorKey: "totalAmount",
      header: t("pages.orders.table.headers.total"),
      cell: (info) => formatOrderCurrency(info.getValue() as number),
    },
    {
      accessorKey: "createdAt",
      header: t("pages.orders.table.headers.created"),
      cell: (info) => formatOrderDate(info.getValue() as string),
    },
    {
      id: "actions",
      header: t("pages.orders.table.headers.actions"),
      cell: (info) =>
        options?.renderRowActions ? (
          options.renderRowActions(info.row.original)
        ) : (
          <Link
            to={`/orders/${info.row.original.id}`}
            className="inline-flex rounded-lg border border-[var(--color-border)] bg-[rgba(15,17,21,0.56)] px-2.5 py-1.5 text-[var(--color-text-primary)] transition-colors hover:bg-[#20283a]"
          >
            {t("pages.orders.table.actions.placeholder")}
          </Link>
        ),
    },
  ];
}
