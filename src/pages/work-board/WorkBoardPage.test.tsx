import { render, screen } from "@testing-library/react";
import { I18nProvider } from "@/shared/i18n/provider";
import { WorkBoardPage } from "./WorkBoardPage";

vi.mock("@/widgets/work-board/overview/WorkBoardOverview", () => ({
  WorkBoardOverview: () => <div data-testid="work-board-overview">Work Board Overview</div>,
}));

function renderPage() {
  render(
    <I18nProvider>
      <WorkBoardPage />
    </I18nProvider>,
  );
}

describe("WorkBoardPage", () => {
  it("renders work board overview widget entry", () => {
    renderPage();
    expect(screen.getByTestId("work-board-overview")).toBeInTheDocument();
  });
});
