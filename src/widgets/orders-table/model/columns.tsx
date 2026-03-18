import type { ReactNode } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import type { TFunction } from "i18next";

import { getPriorityBadgeClass, getStatusBadgeClass } from "@/shared/ui/status-badges";
import type { OrdersTableRow } from "@/widgets/orders-shared/model/types";
import { formatOrderCurrency, formatOrderDate, getOrderStatusChipModifier } from "./presentation";

export function createOrdersTableColumns(
  t: TFunction,
  renderRowActions?: (order: OrdersTableRow) => ReactNode,
): ColumnDef<OrdersTableRow>[] {
  return [
    {
      accessorKey: "number",
      header: t("pages.orders.table.headers.number"),
      cell: (info) => <span className="orders-table__mono">{info.getValue() as string}</span>,
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
        renderRowActions ? (
          renderRowActions(info.row.original)
        ) : (
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-[rgba(15,17,21,0.56)] px-2.5 py-1.5 text-[var(--color-text-primary)]"
          >
            {t("pages.orders.table.actions.placeholder")}
          </button>
        ),
    },
  ];
}
