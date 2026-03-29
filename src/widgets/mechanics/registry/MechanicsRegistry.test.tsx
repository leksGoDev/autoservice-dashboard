import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/shared/i18n/provider";
import { MechanicsRegistry } from "./MechanicsRegistry";

function renderWidget() {
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
        <MechanicsRegistry />
      </I18nProvider>
    </QueryClientProvider>,
  );
}

describe("MechanicsRegistry", () => {
  it("renders data-backed sections", async () => {
    renderWidget();

    expect(await screen.findByText("Mechanics table")).toBeInTheDocument();
    expect(screen.getByText("Availability")).toBeInTheDocument();
    expect(screen.getByText("Assignments summary")).toBeInTheDocument();
  });

  it("applies search to registry", async () => {
    renderWidget();

    await screen.findByText("Mechanics table");

    fireEvent.change(screen.getByLabelText("Search mechanics"), {
      target: { value: "brake" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("Brake Systems")).toBeInTheDocument();
    });
  });
});
