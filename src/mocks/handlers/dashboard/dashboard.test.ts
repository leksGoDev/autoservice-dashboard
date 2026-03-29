import { getRevenueFixtureByRange } from "@/mocks/fixtures/dashboard";
import { DEFAULT_DASHBOARD_RECENT_ORDERS_LIMIT } from "@/shared/api/constants";

async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

describe("dashboardHandlers", () => {
  it("uses default range when range query is omitted", async () => {
    const data = await getJson("/api/dashboard/revenue");

    expect(data).toEqual(getRevenueFixtureByRange("30d"));
  });

  it("returns INVALID_RANGE for invalid range", async () => {
    const data = await getJson("/api/dashboard/revenue?range=invalid");

    expect(data).toEqual({
      code: "INVALID_RANGE",
      message: "range must be one of: 7d, 30d, 90d",
    });
  });

  it("returns INVALID_LIMIT for invalid recent orders limit", async () => {
    const data = await getJson("/api/dashboard/recent-orders?range=30d&limit=0");

    expect(data).toEqual({
      code: "INVALID_LIMIT",
      message: "limit must be a positive integer",
    });
  });

  it("sorts recent orders by updatedAt desc and applies explicit limit", async () => {
    const data = await getJson("/api/dashboard/recent-orders?range=30d&limit=3");

    expect(data).toHaveLength(3);
    expect(new Date(data[0].updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(data[1].updatedAt).getTime());
    expect(new Date(data[1].updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(data[2].updatedAt).getTime());
  });

  it("uses default recent orders limit when limit query is omitted", async () => {
    const data = await getJson("/api/dashboard/recent-orders?range=30d");

    expect(data).toHaveLength(DEFAULT_DASHBOARD_RECENT_ORDERS_LIMIT);
  });
});
