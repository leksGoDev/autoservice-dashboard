import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { getAnalyticsMetricsFixtureByRange } from "@/mocks/fixtures/analytics";
import { I18nProvider } from "@/shared/i18n/provider";
import { AnalyticsOverview } from "./AnalyticsOverview";

vi.mock("@/widgets/dashboard/orders-trend/DashboardOrdersTrend", () => ({
  DashboardOrdersTrend: () => <div>Orders Trend</div>,
}));

vi.mock("@/widgets/dashboard/mechanic-workload/DashboardMechanicWorkload", () => ({
  DashboardMechanicWorkload: () => <div>Mechanic Workload</div>,
}));

vi.mock("@/widgets/analytics/jobs-by-category/AnalyticsJobsByCategoryChart", () => ({
  AnalyticsJobsByCategoryChart: () => <div>Jobs by Category</div>,
}));

function renderOverview() {
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
        <AnalyticsOverview />
      </I18nProvider>
    </QueryClientProvider>,
  );
}

describe("AnalyticsOverview", () => {
  it("renders metrics and chart sections", async () => {
    renderOverview();

    expect(await screen.findByText("Revenue Total")).toBeInTheDocument();
    expect(await screen.findByText("Orders Trend")).toBeInTheDocument();
    expect(await screen.findByText("Jobs by Category")).toBeInTheDocument();
  });

  it("updates metrics when range changes", async () => {
    renderOverview();

    const defaultRevenue = getAnalyticsMetricsFixtureByRange("30d").totalRevenue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
    const shortRangeRevenue = getAnalyticsMetricsFixtureByRange("7d").totalRevenue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

    expect(await screen.findByText(defaultRevenue)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "7D" }));

    await waitFor(() => {
      expect(screen.getByText(shortRangeRevenue)).toBeInTheDocument();
    });
  });
});
