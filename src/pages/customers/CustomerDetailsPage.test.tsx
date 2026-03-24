import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { appRoutes } from "@/app/router";
import { I18nProvider } from "@/shared/i18n/provider";

function renderWithRoute(initialEntry: string) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [initialEntry],
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </QueryClientProvider>,
  );
}

describe("CustomerDetailsPage", () => {
  it("renders customer details sections", async () => {
    renderWithRoute("/customers/cust_001");

    expect(await screen.findByText("Customer information")).toBeInTheDocument();
    expect(screen.getByText("Vehicles list")).toBeInTheDocument();
    expect(screen.getByText("Order history")).toBeInTheDocument();
    expect(screen.getByText("Alex Turner")).toBeInTheDocument();
    expect(screen.getByText("ORD-1008")).toBeInTheDocument();
  });

  it("renders error state for unknown customer", async () => {
    renderWithRoute("/customers/cust_unknown");

    expect(await screen.findByText("Failed to load customer details.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
