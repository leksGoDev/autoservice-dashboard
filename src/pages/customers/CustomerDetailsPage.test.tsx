import { render, screen } from "@testing-library/react";

import { I18nProvider } from "@/shared/i18n/provider";
import { CustomerDetailsPage } from "./CustomerDetailsPage";
import { useCustomerDetailsPageModel } from "./model/use-customer-details-model";

vi.mock("./model/use-customer-details-model", () => ({
  useCustomerDetailsPageModel: vi.fn(),
}));

vi.mock("@/widgets/customers/details/CustomerDetailsOverview", () => ({
  CustomerDetailsOverview: ({ customerId }: { customerId: string | undefined }) => (
    <div data-testid="customer-details-overview">{customerId}</div>
  ),
}));

const mockedUseCustomerDetailsPageModel = vi.mocked(useCustomerDetailsPageModel);

function renderPage() {
  render(
    <I18nProvider>
      <CustomerDetailsPage />
    </I18nProvider>,
  );
}

describe("CustomerDetailsPage", () => {
  beforeEach(() => {
    mockedUseCustomerDetailsPageModel.mockReset();
  });

  it("passes customerId from page params hook into overview widget", () => {
    mockedUseCustomerDetailsPageModel.mockReturnValue({
      customerId: "cust_001",
    });

    renderPage();

    expect(screen.getByTestId("customer-details-overview")).toHaveTextContent("cust_001");
  });
});
