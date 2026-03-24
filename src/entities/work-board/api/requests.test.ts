import { httpRequest } from "@/shared/api/http-client";
import { getWorkBoardData } from "./requests";

vi.mock("@/shared/api/http-client", () => ({
  httpRequest: vi.fn(),
}));

const mockedHttpRequest = vi.mocked(httpRequest);

describe("work board requests", () => {
  beforeEach(() => {
    mockedHttpRequest.mockReset();
  });

  it("requests work-board payload via GET", () => {
    mockedHttpRequest.mockResolvedValueOnce({ columns: [], totalCards: 0, updatedAt: "2026-03-21T10:00:00.000Z" });

    getWorkBoardData();

    expect(mockedHttpRequest).toHaveBeenCalledWith("/work-board", {
      method: "GET",
    });
  });
});
