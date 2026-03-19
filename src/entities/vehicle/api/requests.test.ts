import { httpRequest } from "@/shared/api/http-client";
import { getVehiclesList } from "./requests";

vi.mock("@/shared/api/http-client", () => ({
  httpRequest: vi.fn(),
}));

const mockedHttpRequest = vi.mocked(httpRequest);

describe("vehicle requests", () => {
  beforeEach(() => {
    mockedHttpRequest.mockReset();
  });

  it("sends list request with GET method and empty query by default", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [], page: 1, pageSize: 10, total: 0, totalPages: 1 });

    getVehiclesList();

    expect(mockedHttpRequest).toHaveBeenCalledWith("/vehicles", {
      method: "GET",
      query: {
        page: undefined,
        pageSize: undefined,
        search: undefined,
      },
    });
  });

  it("passes provided query params", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [], page: 2, pageSize: 5, total: 0, totalPages: 1 });

    getVehiclesList({
      page: 2,
      pageSize: 5,
      search: "tesla",
    });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/vehicles", {
      method: "GET",
      query: {
        page: 2,
        pageSize: 5,
        search: "tesla",
      },
    });
  });
});
