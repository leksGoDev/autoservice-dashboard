import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { CustomerDetailsOverview } from "./CustomerDetailsOverview";

function renderOverview(customerId: string | undefined) {
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
          <CustomerDetailsOverview customerId={customerId} />
        </I18nProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("CustomerDetailsOverview", () => {
  it("renders customer details sections for known customer", async () => {
    renderOverview("cust_001");

    expect(await screen.findByText("Customer information")).toBeInTheDocument();
    expect(screen.getByText("Vehicles list")).toBeInTheDocument();
    expect(screen.getByText("Order history")).toBeInTheDocument();
    expect(screen.getByText("Alex Turner")).toBeInTheDocument();
    expect(screen.getByText("ORD-1008")).toBeInTheDocument();
  });

  it("renders error state for unknown customer", async () => {
    renderOverview("cust_unknown");

    expect(await screen.findByText("Failed to load customer details.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
