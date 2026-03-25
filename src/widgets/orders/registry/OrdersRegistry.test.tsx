import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { OrdersRegistry } from "./OrdersRegistry";

function getAlternativeStatus(currentStatus: string) {
  if (currentStatus === "completed") {
    return "in_progress";
  }

  return "completed";
}

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
          <OrdersRegistry />
        </MemoryRouter>
      </I18nProvider>
    </QueryClientProvider>,
  );
}

describe("OrdersRegistry", () => {
  it("updates order status from registry actions", async () => {
    renderRegistry();

    await screen.findByText("Order #");

    const statusSelects = screen.getAllByRole("combobox", { name: "Status" });
    const rowStatusSelect = statusSelects[1] as HTMLSelectElement;
    const nextStatus = getAlternativeStatus(rowStatusSelect.value);

    fireEvent.change(rowStatusSelect, {
      target: { value: nextStatus },
    });

    const updateButtons = screen.getAllByRole("button", { name: "Update status" });
    fireEvent.click(updateButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Order status updated.")).toBeInTheDocument();
    });
  });

  it("toggles order flag from registry actions", async () => {
    renderRegistry();

    await screen.findByText("Order #");

    const flagButtons = [
      ...screen.queryAllByRole("button", { name: "Flag order" }),
      ...screen.queryAllByRole("button", { name: "Remove flag" }),
    ];

    fireEvent.click(flagButtons[0]);

    await waitFor(() => {
      expect(
        screen.queryByText("Order flagged.") ?? screen.queryByText("Order unflagged."),
      ).toBeInTheDocument();
    });
  });
});
