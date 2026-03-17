import type { RecentOrderItem } from "@/entities/dashboard/model/types";

import { WidgetCard } from "../../shared/ui/WidgetCard";

type DashboardRecentOrdersProps = {
  orders: RecentOrderItem[];
};

function formatStatus(status: RecentOrderItem["status"]) {
  if (status === "in_progress") {
    return "In Progress";
  }

  if (status === "waiting_parts") {
    return "Waiting Parts";
  }

  return status[0].toUpperCase() + status.slice(1);
}

function formatPriority(priority: RecentOrderItem["priority"]) {
  return priority[0].toUpperCase() + priority.slice(1);
}

export function DashboardRecentOrders({ orders }: DashboardRecentOrdersProps) {
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
                  <span className={`status-chip status-chip--${order.status.replace("_", "-")}`}>
                    {formatStatus(order.status)}
                  </span>
                </td>
                <td>
                  <span className={`priority-chip priority-chip--${order.priority}`}>
                    {formatPriority(order.priority)}
                  </span>
                </td>
                <td>{order.assignedMechanic}</td>
                <td>${order.totalCost.toLocaleString()}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
}
