import { httpRequest } from "@/shared/api/http-client";
import { getAnalyticsOverview, getAnalyticsRevenue } from "./requests";

vi.mock("@/shared/api/http-client", () => ({
  httpRequest: vi.fn(),
}));

const mockedHttpRequest = vi.mocked(httpRequest);

describe("analytics requests", () => {
  beforeEach(() => {
    mockedHttpRequest.mockReset();
  });

  it("passes explicit range to revenue endpoint", () => {
    mockedHttpRequest.mockResolvedValueOnce([]);

    getAnalyticsRevenue("7d");

    expect(mockedHttpRequest).toHaveBeenCalledWith("/analytics/revenue", {
      method: "GET",
      query: { range: "7d" },
    });
  });

  it("aggregates overview from five analytics requests", async () => {
    const metrics = { totalRevenue: 1000 };
    const revenue = [{ date: "2026-03-20", revenue: 1000 }];
    const ordersPerDay = [{ date: "2026-03-20", total: 4, completed: 3 }];
    const jobsByCategory = [{ category: "Engine", scheduled: 1, inProgress: 2, completed: 3 }];
    const mechanicWorkload = [{ mechanicId: "m-1" }];

    mockedHttpRequest
      .mockResolvedValueOnce(metrics)
      .mockResolvedValueOnce(revenue)
      .mockResolvedValueOnce(ordersPerDay)
      .mockResolvedValueOnce(jobsByCategory)
      .mockResolvedValueOnce(mechanicWorkload);

    const result = await getAnalyticsOverview("7d");

    expect(result).toEqual({
      metrics,
      revenue,
      ordersPerDay,
      jobsByCategory,
      mechanicWorkload,
    });
    expect(mockedHttpRequest).toHaveBeenCalledTimes(5);
    expect(mockedHttpRequest).toHaveBeenNthCalledWith(1, "/analytics/metrics", {
      method: "GET",
      query: { range: "7d" },
    });
    expect(mockedHttpRequest).toHaveBeenNthCalledWith(5, "/analytics/mechanic-workload", {
      method: "GET",
      query: { range: "7d" },
    });
  });
});
