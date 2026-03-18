import type { ReactNode } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import type { TFunction } from "i18next";

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
          <span className={`status-chip status-chip--${getOrderStatusChipModifier(status)}`}>
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
        return <span className={`priority-chip priority-chip--${priority}`}>{t(`order.priority.${priority}`)}</span>;
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
          <button type="button" className="orders-table__action-button">
            {t("pages.orders.table.actions.placeholder")}
          </button>
        ),
    },
  ];
}
