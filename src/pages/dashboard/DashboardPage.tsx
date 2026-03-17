import "./dashboard.css";

import {
  dashboardKpiItems,
  dashboardMechanicWorkload,
  dashboardOrdersTrendData,
  dashboardRecentActivity,
  dashboardRecentOrders,
  dashboardRevenueData,
} from "./model/dashboard-snapshot";
import { DashboardKpiCards } from "../../widgets/dashboard-kpi-cards/DashboardKpiCards";
import { DashboardMechanicWorkload } from "../../widgets/dashboard-mechanic-workload/DashboardMechanicWorkload";
import { DashboardRevenueChart } from "../../widgets/dashboard-revenue-chart/DashboardRevenueChart";
import { DashboardOrdersTrend } from "../../widgets/dashboard-orders-trend/DashboardOrdersTrend";
import { DashboardRecentOrders } from "../../widgets/dashboard-recent-orders/DashboardRecentOrders";
import { DashboardRecentActivity } from "../../widgets/dashboard-recent-activity/DashboardRecentActivity";

export function DashboardPage() {
  return (
    <section className="dashboard-page">
      <header className="dashboard-page__hero">
        <span className="dashboard-page__eyebrow">Overview</span>
        <h1 className="dashboard-page__title">Operations Dashboard</h1>
        <p className="dashboard-page__description">
          Live operational snapshot for order flow, revenue, and recent workshop activity.
        </p>
      </header>

      <DashboardKpiCards items={dashboardKpiItems} />

      <div className="dashboard-page__charts">
        <DashboardRevenueChart data={dashboardRevenueData} />
        <DashboardOrdersTrend data={dashboardOrdersTrendData} />
      </div>

      <div className="dashboard-page__bottom">
        <DashboardRecentOrders orders={dashboardRecentOrders} />
        <div className="dashboard-page__side">
          <DashboardMechanicWorkload items={dashboardMechanicWorkload} />
          <DashboardRecentActivity items={dashboardRecentActivity} />
        </div>
      </div>
    </section>
  );
}
