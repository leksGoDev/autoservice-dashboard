import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { http, HttpResponse } from "msw";

import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";
import { I18nProvider } from "@/shared/i18n/provider";
import { server } from "@/test/test-server";
import { GlobalSearchTopbar } from "./GlobalSearchTopbar";

function renderSearch(initialEntries: string[] = ["/"]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <GlobalSearchTopbar />,
      },
      {
        path: "/orders/:orderId",
        element: <div>Order details route</div>,
      },
      {
        path: "/customers/:customerId",
        element: <div>Customer details route</div>,
      },
      {
        path: "/vehicles/:vehicleId",
        element: <div>Vehicle details route</div>,
      },
    ],
    { initialEntries },
  );

  render(
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </QueryClientProvider>,
  );
}

describe("GlobalSearchTopbar", () => {
  it("shows grouped results for query", async () => {
    renderSearch();

    const input = screen.getByRole("searchbox", { name: "Global search" });

    fireEvent.change(input, { target: { value: "alex" } });

    expect(await screen.findByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Customers")).toBeInTheDocument();
    expect(screen.getByText("Vehicles")).toBeInTheDocument();
  });

  it("navigates to details route with keyboard enter", async () => {
    renderSearch();

    const input = screen.getByRole("searchbox", { name: "Global search" });

    fireEvent.change(input, { target: { value: "alex" } });
    await screen.findAllByRole("option");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(await screen.findByText("Order details route")).toBeInTheDocument();
  });

  it("closes dropdown by escape key", async () => {
    renderSearch();

    const input = screen.getByRole("searchbox", { name: "Global search" });

    fireEvent.change(input, { target: { value: "alex" } });
    await screen.findAllByRole("option");

    fireEvent.keyDown(input, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("shows empty state for unknown query", async () => {
    renderSearch();

    const input = screen.getByRole("searchbox", { name: "Global search" });

    fireEvent.change(input, { target: { value: "no-such-record" } });

    expect(await screen.findByText("No matching records found.")).toBeInTheDocument();
  });

  it("shows error state and allows retry", async () => {
    server.use(
      http.get(toMswPath(apiEndpoints.search.global), () => {
        return HttpResponse.json({ message: "Search failed" }, { status: 500 });
      }),
    );

    renderSearch();

    const input = screen.getByRole("searchbox", { name: "Global search" });

    fireEvent.change(input, { target: { value: "alex" } });

    expect(await screen.findByText("Failed to load search results.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
