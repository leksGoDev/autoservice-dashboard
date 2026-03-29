import { httpRequest } from "@/shared/api/http-client";
import { getGlobalSearchResults } from "./requests";

vi.mock("@/shared/api/http-client", () => ({
  httpRequest: vi.fn(),
}));

const mockedHttpRequest = vi.mocked(httpRequest);

describe("search requests", () => {
  beforeEach(() => {
    mockedHttpRequest.mockReset();
  });

  it("sends global search request with default limit", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [] });

    getGlobalSearchResults({ query: "alex" });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/search", {
      method: "GET",
      query: {
        query: "alex",
        limit: 12,
      },
    });
  });

  it("trims query and passes explicit limit", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [] });

    getGlobalSearchResults({ query: "  ford  ", limit: 5 });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/search", {
      method: "GET",
      query: {
        query: "ford",
        limit: 5,
      },
    });
  });
});
