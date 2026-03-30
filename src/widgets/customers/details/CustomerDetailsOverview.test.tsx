import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    expect(screen.getByText("Aleksey Volkov")).toBeInTheDocument();
    expect(screen.getByText("ORD-1008")).toBeInTheDocument();
  });

  it("renders error state for unknown customer", async () => {
    renderOverview("cust_unknown");

    expect(await screen.findByText("Failed to load customer details.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("edits customer from customer details", async () => {
    renderOverview("cust_001");
    await screen.findByText("Customer information");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "Aleksey Volkov Updated" },
    });
    fireEvent.change(screen.getByLabelText("Phone"), {
      target: { value: "+7 (901) 555-01-09" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "aleksey.volkov.updated@example.ru" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(screen.getAllByText("Aleksey Volkov Updated").length).toBeGreaterThan(0);
    });
  });

  it("closes edit form on cancel without persisting changes", async () => {
    renderOverview("cust_001");
    await screen.findByText("Customer information");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "Alex Draft Name" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("button", { name: "Save changes" })).not.toBeInTheDocument();
    expect(screen.getByText("Aleksey Volkov")).toBeInTheDocument();
    expect(screen.queryByText("Alex Draft Name")).not.toBeInTheDocument();
  });
});
