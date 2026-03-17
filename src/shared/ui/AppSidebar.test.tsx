import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { AppSidebar } from "./AppSidebar";

describe("AppSidebar", () => {
  it("marks current route link as active", () => {
    render(
      <MemoryRouter initialEntries={["/orders"]}>
        <AppSidebar />
      </MemoryRouter>,
    );

    const ordersLink = screen.getByRole("link", { name: "Orders" });
    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });

    expect(ordersLink).toHaveClass("sidebar__link--active");
    expect(dashboardLink).not.toHaveClass("sidebar__link--active");
  });
});
