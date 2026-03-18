import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("shows title from matched route handle", async () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <AppShell />,
          children: [
            {
              path: "orders",
              element: <div>Orders Content</div>,
              handle: { titleKey: "routes.orders" },
            },
          ],
        },
      ],
      {
        initialEntries: ["/orders"],
      },
    );

    render(
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>,
    );

    expect(await screen.findByText("Orders", { selector: ".topbar__title" })).toBeInTheDocument();
    expect(screen.getByText("Orders Content")).toBeInTheDocument();
  });
});
