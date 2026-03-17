import { getRevenueFixtureByRange } from "@/mocks/fixtures/dashboard";

async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

describe("dashboardHandlers", () => {
  it("falls back to default range for invalid range", async () => {
    const data = await getJson("/api/dashboard/revenue?range=invalid");

    expect(data).toEqual(getRevenueFixtureByRange("30d"));
  });
});
