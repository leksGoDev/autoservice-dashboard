import { httpRequest } from "@/shared/api/http-client";
import { createCustomer, getCustomerDetails, getCustomersList, updateCustomer } from "./requests";

vi.mock("@/shared/api/http-client", () => ({
  httpRequest: vi.fn(),
}));

const mockedHttpRequest = vi.mocked(httpRequest);

describe("customer requests", () => {
  beforeEach(() => {
    mockedHttpRequest.mockReset();
  });

  it("sends list request with GET method and empty query by default", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [], page: 1, pageSize: 10, total: 0, totalPages: 1 });

    getCustomersList();

    expect(mockedHttpRequest).toHaveBeenCalledWith("/customers", {
      method: "GET",
      query: {
        page: undefined,
        pageSize: undefined,
        search: undefined,
      },
    });
  });

  it("requests customer details by id", () => {
    mockedHttpRequest.mockResolvedValueOnce({ customer: { id: "cust_001" } });

    getCustomerDetails("cust_001");

    expect(mockedHttpRequest).toHaveBeenCalledWith("/customers/cust_001", {
      method: "GET",
    });
  });

  it("creates customer with POST payload", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "cust_006" });

    createCustomer({
      fullName: "Riley Stone",
      phone: "+1-555-0199",
      email: "riley.stone@example.com",
      loyaltyTier: "standard",
    });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/customers", {
      method: "POST",
      body: {
        fullName: "Riley Stone",
        phone: "+1-555-0199",
        email: "riley.stone@example.com",
        loyaltyTier: "standard",
      },
    });
  });

  it("updates customer with PATCH payload", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "cust_001" });

    updateCustomer("cust_001", {
      fullName: "Alex Turner Updated",
      phone: "+1-555-0101",
      email: "alex.turner.updated@example.com",
      loyaltyTier: "gold",
    });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/customers/cust_001", {
      method: "PATCH",
      body: {
        fullName: "Alex Turner Updated",
        phone: "+1-555-0101",
        email: "alex.turner.updated@example.com",
        loyaltyTier: "gold",
      },
    });
  });
});
