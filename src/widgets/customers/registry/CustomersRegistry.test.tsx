import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { CustomersRegistry } from "./CustomersRegistry";

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
      <MemoryRouter>
        <I18nProvider>
          <CustomersRegistry />
        </I18nProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("CustomersRegistry", () => {
  it("renders loaded state with table and summary", async () => {
    renderRegistry();

    expect(await screen.findByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Customers registry")).toBeInTheDocument();
    expect(screen.getByText(/Showing 1-5 of/)).toBeInTheDocument();
  });

  it("shows empty state for unknown search", async () => {
    renderRegistry();
    await screen.findByText("Name");

    fireEvent.change(screen.getByRole("searchbox", { name: "Customers search" }), {
      target: { value: "no-such-customer" },
    });

    await waitFor(() => {
      expect(screen.getByText("No customers found.")).toBeInTheDocument();
    });
  });

  it("renders entry point link to customer details", async () => {
    renderRegistry();

    const customerLink = await screen.findByRole("link", { name: "Alex Turner" });
    expect(customerLink).toHaveAttribute("href", "/customers/cust_001");
  });
});
