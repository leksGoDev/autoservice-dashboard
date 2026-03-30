import type { UseQueryResult } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

import { useWorkBoardQuery } from "@/entities/work-board/api/queries";
import type { WorkBoardData } from "@/entities/work-board/model/types";
import { I18nProvider } from "@/shared/i18n/provider";
import { WorkBoardOverview } from "./WorkBoardOverview";

vi.mock("@/entities/work-board/api/queries", () => ({
  useWorkBoardQuery: vi.fn(),
}));

vi.mock("@/widgets/work-board/columns/WorkBoardColumns", () => ({
  WorkBoardColumns: () => <div data-testid="work-board-columns">Work Board Columns</div>,
}));

const mockedUseWorkBoardQuery = vi.mocked(useWorkBoardQuery);

function buildQuery(
  overrides: Partial<UseQueryResult<WorkBoardData, Error>> = {},
): UseQueryResult<WorkBoardData, Error> {
  const baseQuery = {
    isLoading: false,
    isError: false,
    data: {
      columns: [
        {
          status: "scheduled",
          cards: [
            {
              id: "wb_ord_001",
              orderId: "ord_001",
              orderNumber: "ORD-1001",
              status: "scheduled",
              priority: "medium",
              customerName: "Aleksey Volkov",
              vehicleLabel: "2019 Honda Accord",
              assignedMechanic: "Artem Bondar",
              jobsCount: 2,
              totalAmount: 680,
              shortContext: "2 jobs | Updated 09:10",
              updatedAt: "2026-03-18T09:10:00.000Z",
              availableActions: ["start_work"],
            },
          ],
        },
      ],
      totalCards: 1,
      updatedAt: "2026-03-21T10:00:00.000Z",
    },
    refetch: vi.fn(),
  };

  return {
    ...baseQuery,
    ...overrides,
  } as unknown as UseQueryResult<WorkBoardData, Error>;
}

function renderOverview() {
  render(
    <I18nProvider>
      <WorkBoardOverview />
    </I18nProvider>,
  );
}

describe("WorkBoardOverview", () => {
  beforeEach(() => {
    mockedUseWorkBoardQuery.mockReset();
  });

  it("renders loading state", () => {
    mockedUseWorkBoardQuery.mockReturnValue(
      buildQuery({
        isLoading: true,
        data: undefined,
      }),
    );

    renderOverview();

    expect(screen.getByText("Loading work board...")).toBeInTheDocument();
  });

  it("renders error state and retries", () => {
    const refetch = vi.fn();
    mockedUseWorkBoardQuery.mockReturnValue(
      buildQuery({
        isError: true,
        data: undefined,
        refetch,
      }),
    );

    renderOverview();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renders empty state", () => {
    mockedUseWorkBoardQuery.mockReturnValue(
      buildQuery({
        data: {
          columns: [],
          totalCards: 0,
          updatedAt: "2026-03-21T10:00:00.000Z",
        },
      }),
    );

    renderOverview();

    expect(screen.getByText("No operational orders on the board yet.")).toBeInTheDocument();
  });

  it("renders board columns in success state", () => {
    mockedUseWorkBoardQuery.mockReturnValue(buildQuery());

    renderOverview();

    expect(screen.getByTestId("work-board-columns")).toBeInTheDocument();
    expect(screen.getByText("Orders on board: 1")).toBeInTheDocument();
  });
});
