import { httpRequest } from "@/shared/api/http-client";
import { getOrderActivity, getOrderDetails, getOrdersList } from "./requests";

vi.mock("@/shared/api/http-client", () => ({
  httpRequest: vi.fn(),
}));

const mockedHttpRequest = vi.mocked(httpRequest);

describe("order requests", () => {
  beforeEach(() => {
    mockedHttpRequest.mockReset();
  });

  it("sends list request with GET method and empty query by default", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [], page: 1, pageSize: 10, total: 0, totalPages: 1 });

    getOrdersList();

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders", {
      method: "GET",
      query: {
        page: undefined,
        pageSize: undefined,
        search: undefined,
        status: undefined,
        priority: undefined,
        assignedMechanic: undefined,
        createdFrom: undefined,
        createdTo: undefined,
        sortBy: undefined,
        sortDirection: undefined,
      },
    });
  });

  it("passes all provided query params", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [], page: 2, pageSize: 20, total: 0, totalPages: 1 });

    getOrdersList({
      page: 2,
      pageSize: 20,
      search: "ford",
      status: "waiting_parts",
      priority: "high",
      assignedMechanic: "Ivan Petrov",
      createdFrom: "2026-03-01",
      createdTo: "2026-03-31",
      sortBy: "updatedAt",
      sortDirection: "asc",
    });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders", {
      method: "GET",
      query: {
        page: 2,
        pageSize: 20,
        search: "ford",
        status: "waiting_parts",
        priority: "high",
        assignedMechanic: "Ivan Petrov",
        createdFrom: "2026-03-01",
        createdTo: "2026-03-31",
        sortBy: "updatedAt",
        sortDirection: "asc",
      },
    });
  });

  it("requests order details by id", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "ord_001" });

    getOrderDetails("ord_001");

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders/ord_001", {
      method: "GET",
    });
  });

  it("requests order activity by id", () => {
    mockedHttpRequest.mockResolvedValueOnce([]);

    getOrderActivity("ord_001");

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders/ord_001/activity", {
      method: "GET",
    });
  });
});
