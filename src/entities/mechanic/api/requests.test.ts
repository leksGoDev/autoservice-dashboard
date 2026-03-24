import { httpRequest } from "@/shared/api/http-client";
import { getMechanicsRegistry, getMechanicsWorkload } from "./requests";

vi.mock("@/shared/api/http-client", () => ({
  httpRequest: vi.fn(),
}));

const mockedHttpRequest = vi.mocked(httpRequest);

describe("mechanics requests", () => {
  beforeEach(() => {
    mockedHttpRequest.mockReset();
  });

  it("uses list endpoint with paging and search query", () => {
    mockedHttpRequest.mockResolvedValueOnce({});

    getMechanicsRegistry({ page: 2, pageSize: 5, search: "engine" });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/mechanics/registry", {
      method: "GET",
      query: {
        page: 2,
        pageSize: 5,
        search: "engine",
      },
    });
  });

  it("uses default range for workload", () => {
    mockedHttpRequest.mockResolvedValueOnce([]);

    getMechanicsWorkload();

    expect(mockedHttpRequest).toHaveBeenCalledWith("/mechanics/workload", {
      method: "GET",
      query: { range: "30d" },
    });
  });
});
