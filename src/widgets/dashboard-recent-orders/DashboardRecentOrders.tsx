import type { FC } from "react";

import type { RecentOrderItem } from "@/entities/dashboard/model/types";
import {
  formatCurrency,
  formatDashboardDate,
  formatOrderPriority,
  formatOrderStatus,
  getStatusChipModifier,
} from "@/entities/dashboard/model/presentation";

import { WidgetCard } from "@/shared/ui/WidgetCard";

interface DashboardRecentOrdersProps {
  orders: RecentOrderItem[];
}

export const DashboardRecentOrders: FC<DashboardRecentOrdersProps> = ({ orders }) => {
  return (
    <WidgetCard title="Recent Orders" description="Latest service orders across all statuses">
      <div className="dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Mechanic</th>
              <th>Total</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="dashboard-table__mono">{order.number}</td>
                <td>{order.customerName}</td>
                <td>{order.vehicleLabel}</td>
                <td>
                  <span className={`status-chip status-chip--${getStatusChipModifier(order.status)}`}>
                    {formatOrderStatus(order.status)}
                  </span>
                </td>
                <td>
                  <span className={`priority-chip priority-chip--${order.priority}`}>
                    {formatOrderPriority(order.priority)}
                  </span>
                </td>
                <td>{order.assignedMechanic}</td>
                <td>{formatCurrency(order.totalCost)}</td>
                <td>{formatDashboardDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
};
