import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { appRoutes } from "./router";

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

describe("router smoke", () => {
  it("renders orders route content", async () => {
    renderWithRoute("/orders");

    expect(await screen.findByText("Orders workspace")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Orders filters toolbar" })).toBeInTheDocument();
  });

  it("renders customers route content", async () => {
    renderWithRoute("/customers");

    expect(await screen.findByText("Customers registry")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Customers search" })).toBeInTheDocument();
  });

  it("renders vehicle details route content with param", async () => {
    renderWithRoute("/vehicles/veh_001");

    expect(await screen.findByText("Service history workspace")).toBeInTheDocument();
    expect(screen.getByText("Vehicle ID: veh_001")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to vehicles" })).toBeInTheDocument();
  });

  it("renders mechanics route content", async () => {
    renderWithRoute("/mechanics");

    expect(await screen.findByText("Mechanics table")).toBeInTheDocument();
    expect(screen.getByText("Assignments summary")).toBeInTheDocument();
  });

  it("renders analytics route content", async () => {
    renderWithRoute("/analytics");

    expect(await screen.findByText("Revenue Total")).toBeInTheDocument();
    expect(screen.getByText("Jobs by Category")).toBeInTheDocument();
  });
});
