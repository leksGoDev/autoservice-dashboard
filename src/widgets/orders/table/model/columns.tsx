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
          className="inline-flex rounded-md border border-[rgba(107,164,255,0.46)] bg-[rgba(107,164,255,0.16)] px-2 py-1 font-mono text-xs font-semibold tracking-[0.02em] text-[#dbeafe] transition-colors hover:bg-[rgba(107,164,255,0.28)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(147,197,253,0.7)]"
        >
          {info.getValue() as string}
        </Link>
      ),
    },
    {
      accessorKey: "customerName",
      header: t("pages.orders.table.headers.customer"),
      cell: (info) => (
        <Link
          to={`/customers/${info.row.original.customerId}`}
          className="inline-flex rounded px-1 py-0.5 text-[var(--color-accent-light-blue)] underline decoration-transparent underline-offset-2 transition-colors hover:text-[#9ac0ff] hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(147,197,253,0.7)]"
        >
          {info.getValue() as string}
        </Link>
      ),
    },
    {
      accessorKey: "vehicleLabel",
      header: t("pages.orders.table.headers.vehicle"),
      cell: (info) => (
        <Link
          to={`/vehicles/${info.row.original.vehicleId}`}
          className="inline-flex rounded px-1 py-0.5 text-[var(--color-accent-light-blue)] underline decoration-transparent underline-offset-2 transition-colors hover:text-[#9ac0ff] hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(147,197,253,0.7)]"
        >
          {info.getValue() as string}
        </Link>
      ),
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
