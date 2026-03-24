import { getAnalyticsRevenueFixtureByRange } from "@/mocks/fixtures/analytics";

async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

describe("analyticsHandlers", () => {
  it("uses default range when range query is omitted", async () => {
    const data = await getJson("/api/analytics/revenue");

    expect(data).toEqual(getAnalyticsRevenueFixtureByRange("30d"));
  });

  it("returns INVALID_RANGE for invalid range", async () => {
    const data = await getJson("/api/analytics/revenue?range=invalid");

    expect(data).toEqual({
      code: "INVALID_RANGE",
      message: "range must be one of: 7d, 30d, 90d",
    });
  });

  it("returns jobs by category data for range", async () => {
    const data = await getJson("/api/analytics/jobs-by-category?range=7d");

    expect(data).toHaveLength(4);
    expect(data[0]).toEqual(
      expect.objectContaining({
        category: expect.any(String),
        scheduled: expect.any(Number),
        inProgress: expect.any(Number),
        completed: expect.any(Number),
      }),
    );
  });
});
