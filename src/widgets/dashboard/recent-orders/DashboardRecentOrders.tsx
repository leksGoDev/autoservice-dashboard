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
import { Link } from "react-router-dom";

import { WidgetCard } from "@/shared/ui/WidgetCard";

type DashboardRecentOrdersProps = {
  orders: RecentOrderItem[];
};

const headerCellClass =
  "border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left text-xs font-semibold text-[var(--color-text-secondary)]";
const bodyCellClass = "border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle";

export const DashboardRecentOrders = ({ orders }: DashboardRecentOrdersProps) => {
  const { t, locale } = useI18n();

  return (
    <WidgetCard title={t("dashboard.recentOrders.title")} description={t("dashboard.recentOrders.description")}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr>
              <th className={headerCellClass}>{t("dashboard.recentOrders.headers.order")}</th>
              <th className={headerCellClass}>{t("dashboard.recentOrders.headers.customer")}</th>
              <th className={headerCellClass}>{t("dashboard.recentOrders.headers.vehicle")}</th>
              <th className={headerCellClass}>{t("dashboard.recentOrders.headers.status")}</th>
              <th className={headerCellClass}>{t("dashboard.recentOrders.headers.priority")}</th>
              <th className={headerCellClass}>{t("dashboard.recentOrders.headers.mechanic")}</th>
              <th className={headerCellClass}>{t("dashboard.recentOrders.headers.total")}</th>
              <th className={headerCellClass}>{t("dashboard.recentOrders.headers.created")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-[#20283a]">
                <td className={bodyCellClass}>
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex whitespace-nowrap rounded-md border border-[rgba(107,164,255,0.46)] bg-[rgba(107,164,255,0.16)] px-2 py-1 font-mono text-xs font-semibold tracking-[0.02em] text-[#dbeafe] transition-colors hover:bg-[rgba(107,164,255,0.28)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(147,197,253,0.7)]"
                  >
                    {order.number}
                  </Link>
                </td>
                <td className={bodyCellClass}>{order.customerName}</td>
                <td className={bodyCellClass}>{order.vehicleLabel}</td>
                <td className={bodyCellClass}>
                  <span
                    className={[
                      "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
                      getStatusBadgeClass(getStatusChipModifier(order.status)),
                    ].join(" ").trim()}
                  >
                    {t(getOrderStatusKey(order.status))}
                  </span>
                </td>
                <td className={bodyCellClass}>
                  <span
                    className={[
                      "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
                      getPriorityBadgeClass(order.priority),
                    ].join(" ").trim()}
                  >
                    {t(getOrderPriorityKey(order.priority))}
                  </span>
                </td>
                <td className={bodyCellClass}>{order.assignedMechanic}</td>
                <td className={[bodyCellClass, "whitespace-nowrap"].join(" ").trim()}>
                  {formatCurrency(order.totalCost, locale)}
                </td>
                <td className={[bodyCellClass, "whitespace-nowrap"].join(" ").trim()}>
                  {formatDashboardDate(order.createdAt, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
};
