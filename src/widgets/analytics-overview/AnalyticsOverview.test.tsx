import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { I18nProvider } from "@/shared/i18n/provider";
import { AnalyticsPage } from "@/pages/analytics/AnalyticsPage";

vi.mock("@/widgets/dashboard-revenue-chart/DashboardRevenueChart", () => ({
  DashboardRevenueChart: () => <div>Revenue Chart</div>,
}));

vi.mock("@/widgets/dashboard-orders-trend/DashboardOrdersTrend", () => ({
  DashboardOrdersTrend: () => <div>Orders Trend</div>,
}));

vi.mock("@/widgets/dashboard-mechanic-workload/DashboardMechanicWorkload", () => ({
  DashboardMechanicWorkload: () => <div>Mechanic Workload</div>,
}));

vi.mock("@/widgets/analytics-jobs-by-category/AnalyticsJobsByCategoryChart", () => ({
  AnalyticsJobsByCategoryChart: () => <div>Jobs by Category</div>,
}));

function renderWidget() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AnalyticsPage />
      </I18nProvider>
    </QueryClientProvider>,
  );
}

describe("AnalyticsPage", () => {
  it("renders metrics and chart sections", async () => {
    renderWidget();

    expect(await screen.findByText("Revenue Total")).toBeInTheDocument();
    expect(screen.getByText("Revenue Chart")).toBeInTheDocument();
    expect(screen.getByText("Jobs by Category")).toBeInTheDocument();
  });

  it("updates metrics when range changes", async () => {
    renderWidget();

    expect(await screen.findByText("$21,940")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "7D" }));

    await waitFor(() => {
      expect(screen.getByText("$3,010")).toBeInTheDocument();
    });
  });
});
