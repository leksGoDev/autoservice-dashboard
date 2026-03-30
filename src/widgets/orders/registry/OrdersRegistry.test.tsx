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
  it("keeps create order entry point in header", async () => {
    renderRegistry();

    const createOrderLink = await screen.findByRole("link", { name: "Create order" });
    expect(createOrderLink).toHaveAttribute("href", "/orders/new");
    expect(createOrderLink.closest("header")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Create order" })).toHaveLength(1);
  });

  it("updates order status from inline status column control", async () => {
    renderRegistry();

    const orderLink = await screen.findByRole("link", { name: "ORD-1001" });
    const row = orderLink.closest("tr") as HTMLElement;
    const rowStatusSelect = row.querySelector('select[aria-label="Status"]') as HTMLSelectElement;
    expect(row.querySelector('button[aria-label="Update status"]')).not.toBeInTheDocument();
    const nextStatus = getAlternativeStatus(rowStatusSelect.value);

    fireEvent.change(rowStatusSelect, {
      target: { value: nextStatus },
    });

    const updateButton = row.querySelector('button[aria-label="Update status"]') as HTMLButtonElement;
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(row.querySelector('button[aria-label="Update status"]')).not.toBeInTheDocument();
    });
  });

  it("toggles order flag from compact actions column control", async () => {
    renderRegistry();

    const orderLink = await screen.findByRole("link", { name: "ORD-1001" });
    const row = orderLink.closest("tr") as HTMLElement;

    const initialFlagButton =
      (row.querySelector('button[aria-label="Flag order"]') as HTMLButtonElement | null) ??
      (row.querySelector('button[aria-label="Remove flag"]') as HTMLButtonElement | null);

    expect(initialFlagButton).toBeTruthy();
    const expectedName = initialFlagButton?.getAttribute("aria-label") === "Flag order" ? "Remove flag" : "Flag order";
    fireEvent.click(initialFlagButton as HTMLButtonElement);

    await waitFor(() => {
      expect(row.querySelector(`button[aria-label="${expectedName}"]`)).toBeInTheDocument();
    });
  });
});
