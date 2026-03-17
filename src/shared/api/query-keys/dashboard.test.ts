import { dashboardQueryKeys } from "./dashboard";

describe("dashboardQueryKeys", () => {
  it("uses default range when range is omitted", () => {
    expect(dashboardQueryKeys.revenue()).toEqual(["dashboard", "revenue", "30d"]);
    expect(dashboardQueryKeys.overview()).toEqual(["dashboard", "overview", "30d"]);
  });

  it("includes custom range in range-based keys", () => {
    expect(dashboardQueryKeys.revenue("7d")).toEqual(["dashboard", "revenue", "7d"]);
    expect(dashboardQueryKeys.ordersTrend("90d")).toEqual(["dashboard", "orders-trend", "90d"]);
    expect(dashboardQueryKeys.overview("7d")).toEqual(["dashboard", "overview", "7d"]);
  });
});
