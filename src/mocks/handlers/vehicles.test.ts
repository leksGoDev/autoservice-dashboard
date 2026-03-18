import { vehiclesFixture } from "@/mocks/fixtures/vehicles";

async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

describe("vehiclesHandlers", () => {
  it("applies search and paginates", async () => {
    const data = await getJson("/api/vehicles?search=ford&page=1&pageSize=1");

    expect(data.page).toBe(1);
    expect(data.pageSize).toBe(1);
    expect(data.total).toBeGreaterThan(0);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].make).toBe("Ford");
  });

  it("returns owner and ordersCount computed fields", async () => {
    const data = await getJson("/api/vehicles?page=1&pageSize=20");

    expect(data.items[0]).toEqual(
      expect.objectContaining({
        owner: expect.any(String),
        ordersCount: expect.any(Number),
      }),
    );
    expect(data.total).toBe(vehiclesFixture.length);
  });

  it("guards invalid page and pageSize", async () => {
    const data = await getJson("/api/vehicles?page=0&pageSize=0");

    expect(data.page).toBe(1);
    expect(data.pageSize).toBe(1);
    expect(data.items).toHaveLength(1);
  });
});
