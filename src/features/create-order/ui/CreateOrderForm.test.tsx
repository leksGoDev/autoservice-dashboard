import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { CreateOrderForm } from "./CreateOrderForm";

const mutateAsyncMock = vi.fn();

vi.mock("@/entities/customer/api/queries", () => ({
  useCustomersListQuery: () => ({
    data: {
      items: [
        {
          id: "cust_001",
          fullName: "Alex Turner",
          phone: "+1-555-0100",
          email: "alex.turner@example.com",
          loyaltyTier: "gold",
          vehiclesCount: 1,
          ordersCount: 2,
          lastVisitAt: "2026-03-18T09:10:00.000Z",
        },
      ],
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

vi.mock("@/entities/vehicle/api/queries", () => ({
  useVehiclesListQuery: () => ({
    data: {
      items: [
        {
          id: "veh_001",
          customerId: "cust_001",
          vin: "1HGCM82633A123001",
          plateNumber: "TX-1842",
          make: "Honda",
          model: "Accord",
          year: 2019,
          owner: "Alex Turner",
          ordersCount: 2,
        },
      ],
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

vi.mock("@/entities/mechanic/api/queries", () => ({
  useMechanicsRegistryQuery: () => ({
    data: {
      items: [
        {
          id: "mech_001",
          name: "Ivan Petrov",
          specialization: "Diagnostics",
          status: "available",
          activeJobs: 2,
          experienceYears: 7,
        },
      ],
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

vi.mock("../api/mutations", () => ({
  useCreateOrderFlowMutation: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
  }),
}));

function renderForm() {
  const router = createMemoryRouter(
    [
      { path: "/orders/new", element: <CreateOrderForm /> },
      { path: "/orders/:orderId", element: <div data-testid="created-order-details" /> },
    ],
    {
      initialEntries: ["/orders/new"],
    },
  );

  return render(
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>,
  );
}

describe("CreateOrderForm", () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
    mutateAsyncMock.mockResolvedValue({ id: "ord_999" });
  });

  it("submits valid payload and redirects to order details", async () => {
    renderForm();

    fireEvent.change(screen.getByRole("combobox", { name: "Customer" }), {
      target: { value: "cust_001" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Vehicle" }), {
      target: { value: "veh_001" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Assigned mechanic" }), {
      target: { value: "Ivan Petrov" },
    });
    fireEvent.change(screen.getByLabelText("Scheduled time"), {
      target: { value: "2026-03-25T09:30" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Complaint" }), {
      target: { value: "Engine noise at startup" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Job name" }), {
      target: { value: "Initial diagnostics" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Category" }), {
      target: { value: "Diagnostics" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create order" }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByTestId("created-order-details")).toBeInTheDocument();
    });
  });
});
