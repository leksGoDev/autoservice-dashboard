import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { AppSidebar } from "./AppSidebar";

describe("AppSidebar", () => {
  it("marks current route link as active", () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/orders"]}>
          <AppSidebar />
        </MemoryRouter>
      </I18nProvider>,
    );

    const ordersLink = screen.getByRole("link", { name: "Orders" });
    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });

    expect(ordersLink).toHaveAttribute("aria-current", "page");
    expect(dashboardLink).not.toHaveAttribute("aria-current", "page");
  });
});
