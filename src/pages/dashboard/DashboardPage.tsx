import "./dashboard.css";

import { useState } from "react";

import type { DashboardRange } from "@/entities/dashboard/model/types";
import { useDashboardOverviewQuery } from "@/entities/dashboard/api/queries";
import { DASHBOARD_RANGES, DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { DashboardKpiCards } from "@/widgets/dashboard-kpi-cards/DashboardKpiCards";
import { DashboardMechanicWorkload } from "@/widgets/dashboard-mechanic-workload/DashboardMechanicWorkload";
import { DashboardRevenueChart } from "@/widgets/dashboard-revenue-chart/DashboardRevenueChart";
import { DashboardOrdersTrend } from "@/widgets/dashboard-orders-trend/DashboardOrdersTrend";
import { DashboardRecentOrders } from "@/widgets/dashboard-recent-orders/DashboardRecentOrders";
import { DashboardRecentActivity } from "@/widgets/dashboard-recent-activity/DashboardRecentActivity";

const DASHBOARD_COPY = {
  eyebrow: "Overview",
  title: "Operations Dashboard",
  description: "Live operational snapshot for order flow, revenue, and recent workshop activity.",
  loading: "Loading dashboard data...",
  error: "Failed to load dashboard data.",
  retry: "Retry",
  empty: "No dashboard data for selected range.",
};

export function DashboardPage() {
  const [range, setRange] = useState<DashboardRange>(DEFAULT_DASHBOARD_RANGE);
  const overviewQuery = useDashboardOverviewQuery(range);

  const isLoading = overviewQuery.isLoading;
  const isError = overviewQuery.isError;
  const data = overviewQuery.data;

  return (
    <section className="dashboard-page">
      <header className="dashboard-page__hero">
        <span className="dashboard-page__eyebrow">{DASHBOARD_COPY.eyebrow}</span>
        <h1 className="dashboard-page__title">{DASHBOARD_COPY.title}</h1>
        <p className="dashboard-page__description">{DASHBOARD_COPY.description}</p>
        <div className="dashboard-page__range">
          {DASHBOARD_RANGES.map((value) => (
            <button
              key={value}
              type="button"
              className={`dashboard-page__range-button${value === range ? " dashboard-page__range-button--active" : ""}`}
              onClick={() => setRange(value)}
            >
              {value.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {isLoading ? (
        <section className="dashboard-state">{DASHBOARD_COPY.loading}</section>
      ) : null}

      {isError ? (
        <section className="dashboard-state dashboard-state--error">
          {DASHBOARD_COPY.error}
          <button type="button" className="dashboard-state__retry" onClick={() => overviewQuery.refetch()}>
            {DASHBOARD_COPY.retry}
          </button>
        </section>
      ) : null}

      {!isLoading && !isError && data ? (
        <>
          <DashboardKpiCards metrics={data.metrics} />

          <div className="dashboard-page__charts">
            <DashboardRevenueChart data={data.revenue} />
            <DashboardOrdersTrend data={data.ordersTrend} />
          </div>

          <div className="dashboard-page__bottom">
            <DashboardRecentOrders orders={data.recentOrders} />
            <div className="dashboard-page__side">
              <DashboardMechanicWorkload items={data.mechanicWorkload} />
              <DashboardRecentActivity items={data.recentActivity} />
            </div>
          </div>
        </>
      ) : null}

      {!isLoading && !isError && !data ? (
        <section className="dashboard-state">
          {DASHBOARD_COPY.empty}
        </section>
      ) : null}
    </section>
  );
}
