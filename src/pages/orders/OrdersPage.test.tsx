import { fireEvent, render, screen } from "@testing-library/react";

import { I18nProvider } from "@/shared/i18n/provider";
import { OrdersPage } from "./OrdersPage";
import { useOrdersPageModel } from "./model/use-orders-page-model";

vi.mock("./model/use-orders-page-model", () => ({
  useOrdersPageModel: vi.fn(),
}));

vi.mock("@/widgets/orders/table/OrdersTable", () => ({
  OrdersTable: () => <div data-testid="orders-table">Orders Table</div>,
}));

vi.mock("@/widgets/orders/toolbar/OrdersToolbar", () => ({
  OrdersToolbar: () => <div data-testid="orders-toolbar">Orders Toolbar</div>,
}));

const mockedUseOrdersPageModel = vi.mocked(useOrdersPageModel);

function buildModel(overrides: Record<string, unknown> = {}): ReturnType<typeof useOrdersPageModel> {
  const baseModel = {
    filters: {
      search: "",
      status: "",
      priority: "",
      mechanic: "",
      createdFrom: "",
      createdTo: "",
    },
    listQuery: {
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    },
    mechanics: [],
    rows: [
      {
        id: "ord_001",
        number: "ORD-1001",
        customerName: "Alex Turner",
        vehicleLabel: "2019 Honda Accord",
        status: "in_progress" as const,
        priority: "medium" as const,
        assignedMechanic: "Ivan Petrov",
        jobsCount: 2,
        totalAmount: 680,
        createdAt: "2026-03-11T08:30:00.000Z",
      },
    ],
    page: 1,
    total: 1,
    totalPages: 1,
    onToolbarChange: vi.fn(),
    onResetFilters: vi.fn(),
    onPageChange: vi.fn(),
  };

  return {
    ...baseModel,
    ...overrides,
  } as unknown as ReturnType<typeof useOrdersPageModel>;
}

function renderPage() {
  render(
    <I18nProvider>
      <OrdersPage />
    </I18nProvider>,
  );
}

describe("OrdersPage", () => {
  beforeEach(() => {
    mockedUseOrdersPageModel.mockReset();
  });

  it("renders loading state", () => {
    mockedUseOrdersPageModel.mockReturnValue(
      buildModel({
        listQuery: {
          isLoading: true,
          isError: false,
          isFetching: false,
          refetch: vi.fn(),
        },
      }),
    );

    renderPage();

    expect(screen.getByText("Loading orders...")).toBeInTheDocument();
  });

  it("renders error state and retries", () => {
    const refetch = vi.fn();
    mockedUseOrdersPageModel.mockReturnValue(
      buildModel({
        listQuery: {
          isLoading: false,
          isError: true,
          isFetching: false,
          refetch,
        },
      }),
    );

    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renders empty state", () => {
    mockedUseOrdersPageModel.mockReturnValue(
      buildModel({
        rows: [],
      }),
    );

    renderPage();
    expect(screen.getByText("No orders found for selected filters.")).toBeInTheDocument();
  });

  it("renders table in success state", () => {
    mockedUseOrdersPageModel.mockReturnValue(buildModel());

    renderPage();

    expect(screen.getByTestId("orders-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("orders-table")).toBeInTheDocument();
  });
});
