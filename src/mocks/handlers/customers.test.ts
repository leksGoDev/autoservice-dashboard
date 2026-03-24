import { customersFixture } from "@/mocks/fixtures/customers";

async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

describe("customersHandlers", () => {
  it("applies search and paginates", async () => {
    const data = await getJson("/api/customers?search=alex&page=1&pageSize=1");

    expect(data.page).toBe(1);
    expect(data.pageSize).toBe(1);
    expect(data.total).toBeGreaterThan(0);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].fullName).toContain("Alex");
  });

  it("returns computed fields", async () => {
    const data = await getJson("/api/customers?page=1&pageSize=20");

    expect(data.items[0]).toEqual(
      expect.objectContaining({
        vehiclesCount: expect.any(Number),
        ordersCount: expect.any(Number),
      }),
    );
    expect(data.total).toBe(customersFixture.length);
  });

  it("guards invalid page and pageSize", async () => {
    const data = await getJson("/api/customers?page=0&pageSize=0");

    expect(data.page).toBe(1);
    expect(data.pageSize).toBe(1);
    expect(data.items).toHaveLength(1);
  });

  it("returns customer details by id", async () => {
    const data = await getJson("/api/customers/cust_001");

    expect(data).toEqual(
      expect.objectContaining({
        customer: expect.objectContaining({
          id: "cust_001",
          fullName: expect.any(String),
        }),
        vehicles: expect.any(Array),
        orders: expect.any(Array),
      }),
    );
  });

  it("returns 404 for unknown customer id", async () => {
    const response = await fetch("/api/customers/cust_unknown");

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ message: "Customer not found" });
  });
});
