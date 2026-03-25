import { render, screen } from "@testing-library/react";

import { AnalyticsPage } from "@/pages/analytics/AnalyticsPage";
import { I18nProvider } from "@/shared/i18n/provider";

vi.mock("@/widgets/analytics/overview", () => ({
  AnalyticsOverview: () => <div data-testid="analytics-overview">Analytics Overview</div>,
}));

function renderPage() {
  render(
    <I18nProvider>
      <AnalyticsPage />
    </I18nProvider>,
  );
}

describe("AnalyticsPage", () => {
  it("renders analytics overview widget entry", () => {
    renderPage();
    expect(screen.getByTestId("analytics-overview")).toBeInTheDocument();
  });
});
