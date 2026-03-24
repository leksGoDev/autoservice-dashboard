import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { OrderDetails } from "@/entities/order/model/types";
import { I18nProvider } from "@/shared/i18n/provider";
import { OrderDetailsPage } from "./OrderDetailsPage";
import { useOrderDetailsPageModel } from "./model/use-order-details-page-model";

vi.mock("./model/use-order-details-page-model", () => ({
  useOrderDetailsPageModel: vi.fn(),
}));

const mockedUseOrderDetailsPageModel = vi.mocked(useOrderDetailsPageModel);

function buildOrder(): OrderDetails {
  return {
    id: "ord_001",
    number: "ORD-1001",
    status: "in_progress",
    priority: "medium",
    customerId: "cust_001",
    customerName: "Alex Turner",
    vehicleId: "veh_001",
    vehicleLabel: "2019 Honda Accord",
    assignedMechanic: "Ivan Petrov",
    jobsCount: 2,
    totalAmount: 680,
    createdAt: "2026-03-11T08:30:00.000Z",
    updatedAt: "2026-03-18T09:10:00.000Z",
    flagged: false,
    customer: {
      id: "cust_001",
      fullName: "Alex Turner",
      phone: "+1-555-0100",
      email: "alex.turner@example.com",
      loyaltyTier: "gold",
    },
    vehicle: {
      id: "veh_001",
      vin: "1HGCM82633A123001",
      plateNumber: "TX-1842",
      make: "Honda",
      model: "Accord",
      year: 2019,
    },
    jobs: [
      {
        id: "ord_001_job_1",
        name: "Initial inspection",
        category: "Diagnostics",
        status: "in_progress",
        assignedMechanic: "Ivan Petrov",
        estimatedHours: 1.2,
        actualHours: 0.8,
        laborPrice: 120,
      },
    ],
    parts: [
      {
        id: "ord_001_part_1",
        jobId: "ord_001_job_1",
        jobName: "Initial inspection",
        name: "Oil filter",
        quantity: 1,
        unitPrice: 18,
        totalPrice: 18,
      },
    ],
  };
}

function buildModel(overrides: Record<string, unknown> = {}): ReturnType<typeof useOrderDetailsPageModel> {
  return {
    orderId: "ord_001",
    order: buildOrder(),
    activity: [
      {
        id: "ord_001_activity_1",
        type: "order_created",
        timestamp: "2026-03-11T08:30:00.000Z",
        actor: "Service Advisor",
        description: "Work order created.",
      },
    ],
    detailsQuery: {
      refetch: vi.fn(),
    },
    activityQuery: {
      refetch: vi.fn(),
    },
    isLoading: false,
    isError: false,
    isNotFound: false,
    isActivityLoading: false,
    isActivityError: false,
    refetchAll: vi.fn(),
    refetchActivity: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useOrderDetailsPageModel>;
}

function renderPage() {
  render(
    <MemoryRouter>
      <I18nProvider>
        <OrderDetailsPage />
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe("OrderDetailsPage", () => {
  beforeEach(() => {
    mockedUseOrderDetailsPageModel.mockReset();
  });

  it("renders loading state", () => {
    mockedUseOrderDetailsPageModel.mockReturnValue(
      buildModel({
        isLoading: true,
      }),
    );

    renderPage();

    expect(screen.getByText("Loading order details...")).toBeInTheDocument();
  });

  it("renders error state and retries", () => {
    const refetchAll = vi.fn();

    mockedUseOrderDetailsPageModel.mockReturnValue(
      buildModel({
        isError: true,
        refetchAll,
      }),
    );

    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(refetchAll).toHaveBeenCalledTimes(1);
  });

  it("renders empty state", () => {
    mockedUseOrderDetailsPageModel.mockReturnValue(
      buildModel({
        isNotFound: true,
        order: undefined,
      }),
    );

    renderPage();

    expect(screen.getByText("Order was not found.")).toBeInTheDocument();
  });

  it("renders all order detail sections", () => {
    mockedUseOrderDetailsPageModel.mockReturnValue(buildModel());

    renderPage();

    expect(screen.getByText("Order details workspace")).toBeInTheDocument();
    expect(screen.getByText("Order summary")).toBeInTheDocument();
    expect(screen.getByText("Customer information")).toBeInTheDocument();
    expect(screen.getByText("Vehicle information")).toBeInTheDocument();
    expect(screen.getByText("Service jobs")).toBeInTheDocument();
    expect(screen.getByText("Parts list")).toBeInTheDocument();
    expect(screen.getByText("Activity timeline")).toBeInTheDocument();
  });
});
