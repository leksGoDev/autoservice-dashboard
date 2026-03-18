import type { FC } from "react";

import type { RecentOrderItem } from "@/entities/dashboard/model/types";
import {
  formatCurrency,
  formatDashboardDate,
  getOrderPriorityKey,
  getOrderStatusKey,
  getStatusChipModifier,
} from "@/entities/dashboard/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { getPriorityBadgeClass, getStatusBadgeClass } from "@/shared/ui/status-badges";

import { WidgetCard } from "@/shared/ui/WidgetCard";

interface DashboardRecentOrdersProps {
  orders: RecentOrderItem[];
}

export const DashboardRecentOrders: FC<DashboardRecentOrdersProps> = ({ orders }) => {
  const { t, locale } = useI18n();

  return (
    <WidgetCard title={t("dashboard.recentOrders.title")} description={t("dashboard.recentOrders.description")}>
      <div className="dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>{t("dashboard.recentOrders.headers.order")}</th>
              <th>{t("dashboard.recentOrders.headers.customer")}</th>
              <th>{t("dashboard.recentOrders.headers.vehicle")}</th>
              <th>{t("dashboard.recentOrders.headers.status")}</th>
              <th>{t("dashboard.recentOrders.headers.priority")}</th>
              <th>{t("dashboard.recentOrders.headers.mechanic")}</th>
              <th>{t("dashboard.recentOrders.headers.total")}</th>
              <th>{t("dashboard.recentOrders.headers.created")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="dashboard-table__mono">{order.number}</td>
                <td>{order.customerName}</td>
                <td>{order.vehicleLabel}</td>
                <td>
                  <span
                    className={[
                      "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
                      getStatusBadgeClass(getStatusChipModifier(order.status)),
                    ].join(" ").trim()}
                  >
                    {t(getOrderStatusKey(order.status))}
                  </span>
                </td>
                <td>
                  <span
                    className={[
                      "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
                      getPriorityBadgeClass(order.priority),
                    ].join(" ").trim()}
                  >
                    {t(getOrderPriorityKey(order.priority))}
                  </span>
                </td>
                <td>{order.assignedMechanic}</td>
                <td>{formatCurrency(order.totalCost, locale)}</td>
                <td>{formatDashboardDate(order.createdAt, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
};
