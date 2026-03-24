import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { I18nProvider } from "@/shared/i18n/provider";
import { OrderDetailsPage } from "./OrderDetailsPage";
import { useOrderDetailsPageModel } from "./model/use-order-details-page-model";

vi.mock("./model/use-order-details-page-model", () => ({
  useOrderDetailsPageModel: vi.fn(),
}));

vi.mock("@/widgets/orders/details/OrderDetailsOverview", () => ({
  OrderDetailsOverview: ({ orderId }: { orderId: string | undefined }) => (
    <div data-testid="order-details-overview">{orderId}</div>
  ),
}));

const mockedUseOrderDetailsPageModel = vi.mocked(useOrderDetailsPageModel);

function renderPage() {
  render(
    <MemoryRouter>
      <I18nProvider>
        <OrderDetailsPage />
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe("OrderDetailsPage", () => {
  beforeEach(() => {
    mockedUseOrderDetailsPageModel.mockReset();
  });

  it("passes orderId from page params hook into overview widget", () => {
    mockedUseOrderDetailsPageModel.mockReturnValue({
      orderId: "ord_001",
    });

    renderPage();

    expect(screen.getByTestId("order-details-overview")).toHaveTextContent("ord_001");
  });
});
