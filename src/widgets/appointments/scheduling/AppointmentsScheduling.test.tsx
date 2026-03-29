import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { AppointmentsScheduling } from "./AppointmentsScheduling";

function renderScheduling() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <MemoryRouter>
          <AppointmentsScheduling />
        </MemoryRouter>
      </I18nProvider>
    </QueryClientProvider>,
  );
}

describe("AppointmentsScheduling", () => {
  it("renders grouped sections", async () => {
    renderScheduling();

    expect(await screen.findByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("filters by mechanic from toolbar", async () => {
    renderScheduling();

    await screen.findByText("Today");

    const toolbar = screen.getByRole("region", { name: "Appointments filters toolbar" });
    const mechanicSelect = within(toolbar).getByRole("combobox", { name: "Mechanic" });

    fireEvent.change(mechanicSelect, {
      target: { value: "Ivan Petrov" },
    });

    await waitFor(() => {
      expect(screen.getAllByText("Ivan Petrov").length).toBeGreaterThan(0);
    });
  });

  it("starts confirm action from row control", async () => {
    renderScheduling();

    await screen.findByText("Today");

    const confirmButtons = screen.getAllByRole("button", { name: "Confirm" });
    const targetButton = confirmButtons[0];
    const row = targetButton.closest("tr");

    if (!row) {
      throw new Error("Expected confirm action to be rendered inside a table row.");
    }

    fireEvent.click(targetButton);

    await waitFor(() => {
      expect(within(row).getByRole("button", { name: "Confirm" })).toBeDisabled();
    });
  });

  it("converts appointment to order from row action", async () => {
    renderScheduling();

    await screen.findByText("Today");

    const convertButtons = screen.getAllByRole("button", { name: "Convert to order" });
    fireEvent.click(convertButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Appointment converted to order.")).toBeInTheDocument();
    });
  });
});
