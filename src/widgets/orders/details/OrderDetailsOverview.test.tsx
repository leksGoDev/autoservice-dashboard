import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { OrderDetailsOverview } from "./OrderDetailsOverview";

function renderOverview(orderId: string | undefined) {
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
  it("renders order details sections for known order", async () => {
    renderOverview("ord_001");

    expect(await screen.findByText("Order details workspace")).toBeInTheDocument();
    expect(screen.getByText("Order summary")).toBeInTheDocument();
    expect(screen.getByText("Activity timeline")).toBeInTheDocument();
    expect(screen.getByText("ORD-1001")).toBeInTheDocument();
  });

  it("renders empty state for unknown order", async () => {
    renderOverview("ord_unknown");

    expect(await screen.findByText("Order was not found.")).toBeInTheDocument();
  });
});
