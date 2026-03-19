import { httpRequest } from "@/shared/api/http-client";
import {
  getDashboardMetrics,
  getDashboardOverview,
  getDashboardRecentOrders,
  getDashboardRevenue,
} from "./requests";

vi.mock("@/shared/api/http-client", () => ({
  httpRequest: vi.fn(),
}));

const mockedHttpRequest = vi.mocked(httpRequest);

describe("dashboard requests", () => {
  beforeEach(() => {
    mockedHttpRequest.mockReset();
  });

  it("uses default range when range is omitted", () => {
    mockedHttpRequest.mockResolvedValueOnce({});

    getDashboardMetrics();

    expect(mockedHttpRequest).toHaveBeenCalledWith("/dashboard/metrics", {
      method: "GET",
      query: { range: "30d" },
    });
  });

  it("passes explicit range", () => {
    mockedHttpRequest.mockResolvedValueOnce([]);

    getDashboardRevenue("7d");

    expect(mockedHttpRequest).toHaveBeenCalledWith("/dashboard/revenue", {
      method: "GET",
      query: { range: "7d" },
    });
  });

  it("uses default range and optional limit for recent orders", () => {
    mockedHttpRequest.mockResolvedValueOnce([]);
    mockedHttpRequest.mockResolvedValueOnce([]);

    getDashboardRecentOrders();
    getDashboardRecentOrders({ range: "90d", limit: 3 });

    expect(mockedHttpRequest).toHaveBeenNthCalledWith(1, "/dashboard/recent-orders", {
      method: "GET",
      query: { range: "30d", limit: undefined },
    });
    expect(mockedHttpRequest).toHaveBeenNthCalledWith(2, "/dashboard/recent-orders", {
      method: "GET",
      query: { range: "90d", limit: 3 },
    });
  });

  it("aggregates overview from six dashboard requests", async () => {
    const metrics = { active: 1 };
    const revenue = [{ date: "2026-03-20", revenue: 1000 }];
    const ordersTrend = [{ date: "2026-03-20", total: 3, completed: 1 }];
    const mechanicWorkload = [{ mechanicId: "m-1" }];
    const recentActivity = [{ id: "a-1" }];
    const recentOrders = [{ id: "o-1" }];

    mockedHttpRequest
      .mockResolvedValueOnce(metrics)
      .mockResolvedValueOnce(revenue)
      .mockResolvedValueOnce(ordersTrend)
      .mockResolvedValueOnce(mechanicWorkload)
      .mockResolvedValueOnce(recentActivity)
      .mockResolvedValueOnce(recentOrders);

    const result = await getDashboardOverview("7d");

    expect(result).toEqual({
      metrics,
      revenue,
      ordersTrend,
      mechanicWorkload,
      recentActivity,
      recentOrders,
    });

    expect(mockedHttpRequest).toHaveBeenCalledTimes(6);
    expect(mockedHttpRequest).toHaveBeenNthCalledWith(1, "/dashboard/metrics", {
      method: "GET",
      query: { range: "7d" },
    });
    expect(mockedHttpRequest).toHaveBeenNthCalledWith(6, "/dashboard/recent-orders", {
      method: "GET",
      query: { range: "7d", limit: undefined },
    });
  });
});
