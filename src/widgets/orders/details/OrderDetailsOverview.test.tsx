import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { OrderDetailsOverview } from "./OrderDetailsOverview";

function renderOverview(orderId: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <I18nProvider>
          <OrderDetailsOverview orderId={orderId} />
        </I18nProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("OrderDetailsOverview", () => {
  it("assigns mechanic from order details action block", async () => {
    renderOverview("ord_001");

    await screen.findByText("Order summary");

    const mechanicSelects = screen.getAllByRole("combobox", { name: "Mechanic" });
    const mechanicSelect = mechanicSelects[0] as HTMLSelectElement;
    await waitFor(() => {
      expect(mechanicSelect.options.length).toBeGreaterThan(1);
    });

    const options = Array.from(mechanicSelect.options).map((option) => option.value);
    const nextMechanic = options.find((option) => option !== mechanicSelect.value) ?? options[0];

    fireEvent.change(mechanicSelect, {
      target: { value: nextMechanic },
    });

    fireEvent.click(screen.getByRole("button", { name: "Assign mechanic" }));

    await waitFor(() => {
      expect(screen.getByText("Mechanic assignment updated.")).toBeInTheDocument();
    });
  });

  it("toggles flag from order details action block", async () => {
    renderOverview("ord_001");

    await screen.findByText("Order summary");

    fireEvent.click(screen.getByRole("button", { name: "Flag order" }));

    await waitFor(() => {
      expect(screen.getByText("Order flagged.")).toBeInTheDocument();
    });
  });
});
