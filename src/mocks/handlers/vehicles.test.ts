import { vehiclesFixture } from "@/mocks/fixtures/vehicles";

async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return {
    status: response.status,
    body: await response.json(),
  };
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

  it("returns vehicle details by id", async () => {
    const data = await getJson("/api/vehicles/veh_001");

    expect(data).toEqual(
      expect.objectContaining({
        id: "veh_001",
        owner: expect.any(String),
        ordersCount: expect.any(Number),
      }),
    );
  });

  it("returns service history by vehicle id", async () => {
    const data = await getJson("/api/vehicles/veh_001/service-history");

    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toEqual(
      expect.objectContaining({
        orderId: expect.any(String),
        orderNumber: expect.any(String),
        status: expect.any(String),
        totalAmount: expect.any(Number),
        updatedAt: expect.any(String),
      }),
    );
  });

  it("creates vehicle inline", async () => {
    const before = await getJson("/api/vehicles?page=1&pageSize=50");
    const created = await postJson("/api/vehicles", {
      customerId: "cust_001",
      vin: "1HGCM82633A123099",
      plateNumber: "TX-9001",
      make: "Honda",
      model: "Civic",
      year: 2023,
    });
    const after = await getJson("/api/vehicles?page=1&pageSize=50");

    expect(created.status).toBe(201);
    expect(created.body.owner).toBe("Alex Turner");
    expect(after.total).toBe(before.total + 1);
  });
});
