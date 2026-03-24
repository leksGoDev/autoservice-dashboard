import { render, screen } from "@testing-library/react";

import { I18nProvider } from "@/shared/i18n/provider";
import { OrdersPage } from "./OrdersPage";
vi.mock("@/widgets/orders/registry/OrdersRegistry", () => ({
  OrdersRegistry: () => <div data-testid="orders-registry">Orders Registry</div>,
}));

function renderPage() {
  render(
    <I18nProvider>
      <OrdersPage />
    </I18nProvider>,
  );
}

describe("OrdersPage", () => {
  it("renders orders registry widget entry", () => {
    renderPage();
    expect(screen.getByTestId("orders-registry")).toBeInTheDocument();
  });
});
