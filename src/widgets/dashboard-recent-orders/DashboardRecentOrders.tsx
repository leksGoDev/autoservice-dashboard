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

type DashboardRecentOrdersProps = {
  orders: RecentOrderItem[];
};

const headerCellClass =
  "border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left text-[12px] font-semibold text-[var(--color-text-secondary)]";
const bodyCellClass = "border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle";

export const DashboardRecentOrders = ({ orders }: DashboardRecentOrdersProps) => {
  const { t, locale } = useI18n();

  return (
    <WidgetCard title={t("dashboard.recentOrders.title")} description={t("dashboard.recentOrders.description")}>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left text-[13px]">
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
                <td className={`${bodyCellClass} font-mono text-[#c9d1dd]`}>{order.number}</td>
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
                <td className={bodyCellClass}>{formatCurrency(order.totalCost, locale)}</td>
                <td className={bodyCellClass}>{formatDashboardDate(order.createdAt, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
};
