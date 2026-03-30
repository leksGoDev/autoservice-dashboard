import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { CreateOrderForm } from "./CreateOrderForm";

const mutateAsyncMock = vi.fn();

vi.mock("../api/queries", () => ({
  useCreateOrderBootstrapQuery: () => ({
    customers: [
      {
        id: "cust_001",
        fullName: "Aleksey Volkov",
        phone: "+7 (901) 555-01-00",
        email: "aleksey.volkov@example.ru",
        loyaltyTier: "gold",
        vehiclesCount: 1,
        ordersCount: 2,
        lastVisitAt: "2026-03-18T09:10:00.000Z",
      },
    ],
    vehicles: [
      {
        id: "veh_001",
        customerId: "cust_001",
        vin: "1HGCM82633A123001",
        plateNumber: "TX-1842",
        make: "Honda",
        model: "Accord",
        year: 2019,
        owner: "Aleksey Volkov",
        ordersCount: 2,
      },
    ],
    mechanics: ["Artem Bondar"],
    isLoading: false,
    isVehiclesLoading: false,
    hasError: false,
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
      target: { value: "Artem Bondar" },
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

  it("keeps existing vehicle selection gated until existing customer is selected", () => {
    renderForm();

    expect(screen.getByRole("combobox", { name: "Vehicle" })).toBeDisabled();
    expect(screen.getByText("Select a customer first to choose an existing vehicle.")).toBeInTheDocument();
  });

  it("forces new vehicle flow when customer mode is new", async () => {
    renderForm();

    fireEvent.click(screen.getByRole("radio", { name: "Create customer inline" }));

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "Use existing vehicle" })).toBeDisabled();
    });

    expect(screen.getByRole("radio", { name: "Create vehicle inline" })).toBeChecked();
    expect(screen.getByText("For a new customer, create a new vehicle in this form.")).toBeInTheDocument();
  });
});
