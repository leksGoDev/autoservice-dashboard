import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { VehiclesRegistry } from "./VehiclesRegistry";

function renderRegistry() {
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
        <MemoryRouter>
          <VehiclesRegistry />
        </MemoryRouter>
      </I18nProvider>
    </QueryClientProvider>,
  );
}

describe("VehiclesRegistry", () => {
  it("renders loaded table state", async () => {
    renderRegistry();

    expect(await screen.findByText("Plate Number")).toBeInTheDocument();
    expect(screen.getByText("Vehicles Registry")).toBeInTheDocument();
  });

  it("applies search and shows clear button", async () => {
    renderRegistry();

    await screen.findByText("Plate Number");

    fireEvent.change(screen.getByLabelText("Search vehicles"), {
      target: { value: "tesla" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("Tesla")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
  });

  it("creates vehicle with linked customer from vehicles section", async () => {
    renderRegistry();
    await screen.findByText("Plate Number");

    fireEvent.click(screen.getByRole("button", { name: "Create vehicle" }));

    const ownerSelect = screen.getByLabelText("Owner customer") as HTMLSelectElement;
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /Aleksey Volkov/ })).toBeInTheDocument();
    });
    fireEvent.change(ownerSelect, {
      target: { value: "cust_001" },
    });
    expect(ownerSelect.value).toBe("cust_001");

    fireEvent.change(screen.getByLabelText("VIN"), {
      target: { value: "1HGCM82633A123099" },
    });
    fireEvent.change(screen.getByLabelText("Plate number"), {
      target: { value: "TX-9001" },
    });
    fireEvent.change(screen.getByLabelText("Make"), {
      target: { value: "Honda" },
    });
    fireEvent.change(screen.getByLabelText("Model"), {
      target: { value: "Civic" },
    });
    fireEvent.change(screen.getByLabelText("Year"), {
      target: { value: "2023" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create vehicle" }));
    await waitFor(() => {
      expect(screen.queryByText("Customer is required")).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Search vehicles"), {
      target: { value: "tx-9001" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("TX-9001")).toBeInTheDocument();
    });
  });
});
