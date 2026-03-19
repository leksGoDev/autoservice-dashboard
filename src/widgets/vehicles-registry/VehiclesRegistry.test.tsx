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

    fireEvent.change(screen.getByPlaceholderText("Plate, VIN, make, model, owner"), {
      target: { value: "tesla" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("Tesla")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
  });
});
