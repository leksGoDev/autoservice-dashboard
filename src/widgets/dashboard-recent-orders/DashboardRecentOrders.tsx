import { WidgetCard } from "../../shared/ui/WidgetCard";

export type RecentOrder = {
  id: string;
  customer: string;
  vehicle: string;
  status: "Scheduled" | "In Progress" | "Waiting Parts" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High" | "Urgent";
  mechanic: string;
  totalCost: number;
  createdAt: string;
};

type DashboardRecentOrdersProps = {
  orders: RecentOrder[];
};

function token(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
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
                <td className="dashboard-table__mono">{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.vehicle}</td>
                <td>
                  <span className={`status-chip status-chip--${token(order.status)}`}>{order.status}</span>
                </td>
                <td>
                  <span className={`priority-chip priority-chip--${token(order.priority)}`}>{order.priority}</span>
                </td>
                <td>{order.mechanic}</td>
                <td>${order.totalCost.toLocaleString()}</td>
                <td>{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
}
