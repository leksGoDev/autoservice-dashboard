import { render, screen } from "@testing-library/react";

import { I18nProvider } from "@/shared/i18n/provider";
import { CreateOrderPage } from "./CreateOrderPage";

vi.mock("@/widgets/orders/create-order/CreateOrderWorkspace", () => ({
  CreateOrderWorkspace: () => <div data-testid="create-order-workspace">Create Order Workspace</div>,
}));

function renderPage() {
  render(
    <I18nProvider>
      <CreateOrderPage />
    </I18nProvider>,
  );
}

describe("CreateOrderPage", () => {
  it("renders create order workspace widget entry", () => {
    renderPage();
    expect(screen.getByTestId("create-order-workspace")).toBeInTheDocument();
  });
});
