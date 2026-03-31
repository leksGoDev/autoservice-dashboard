import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

    fireEvent.click(screen.getAllByRole("button", { name: "Assign mechanic" })[0]);

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

  it("runs service execution flow for jobs and parts", async () => {
    renderOverview("ord_001");

    await screen.findByText("Order summary");

    fireEvent.change(screen.getByRole("textbox", { name: "Job name" }), {
      target: { value: "Cooling system flush" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Category" }), {
      target: { value: "Maintenance" },
    });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Estimated hours" }), {
      target: { value: "1.5" },
    });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Labor price" }), {
      target: { value: "175" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add job" }));

    await waitFor(() => {
      expect(screen.getByText("Service job added.")).toBeInTheDocument();
    });

    const jobStatusSelect = screen.getByRole("combobox", { name: "Job status Brake system service" });
    fireEvent.change(jobStatusSelect, { target: { value: "pending" } });
    fireEvent.click(within(jobStatusSelect.closest("tr") as HTMLElement).getByRole("button", { name: "Update status" }));

    await waitFor(() => {
      expect(screen.getAllByRole("row", { name: /Brake system service/i })[0]).toHaveTextContent("Pending");
    });

    const jobMechanicSelect = screen.getByRole("combobox", { name: "Job mechanic Brake system service" });
    fireEvent.change(jobMechanicSelect, { target: { value: "Artem Bondar" } });
    fireEvent.click(
      within(jobMechanicSelect.closest("tr") as HTMLElement).getByRole("button", { name: "Assign mechanic" }),
    );

    await waitFor(() => {
      expect(screen.getAllByRole("row", { name: /Brake system service/i })[0]).toHaveTextContent("Artem Bondar");
    });

    fireEvent.change(screen.getByRole("textbox", { name: "Part name" }), {
      target: { value: "Coolant" },
    });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Quantity" }), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Unit price" }), {
      target: { value: "26" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add part" }));

    await waitFor(() => {
      expect(screen.getByText("Part added to job.")).toBeInTheDocument();
    });

    const coolantRow = await screen.findByRole("row", { name: /Coolant/i });
    const coolantQuantityInput = within(coolantRow).getByRole("spinbutton", { name: /Part quantity Coolant/i });
    fireEvent.change(coolantQuantityInput, { target: { value: "4" } });
    fireEvent.click(within(coolantRow).getByRole("button", { name: "Update qty" }));

    await waitFor(() => {
      expect(screen.getByText("Part quantity updated.")).toBeInTheDocument();
    });

    fireEvent.click(within(coolantRow).getByRole("button", { name: "Remove" }));

    await waitFor(() => {
      expect(screen.getByText("Part removed from job.")).toBeInTheDocument();
    });
  });

  it("keeps add buttons disabled until required fields are provided", async () => {
    renderOverview("ord_001");

    await screen.findByText("Order summary");

    const addJobButton = screen.getByRole("button", { name: "Add job" });
    const addPartButton = screen.getByRole("button", { name: "Add part" });

    expect(addJobButton).toBeDisabled();
    expect(addPartButton).toBeDisabled();

    fireEvent.change(screen.getByRole("textbox", { name: "Job name" }), {
      target: { value: "Cooling system flush" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Category" }), {
      target: { value: "Maintenance" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Part name" }), {
      target: { value: "Coolant" },
    });

    await waitFor(() => {
      expect(addJobButton).toBeEnabled();
      expect(addPartButton).toBeEnabled();
    });
  });
});
