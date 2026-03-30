import { customersFixture } from "@/mocks/fixtures/customers";

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

async function patchJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "PATCH",
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

describe("customersHandlers", () => {
  it("applies search and paginates", async () => {
    const data = await getJson("/api/customers?search=alek&page=1&pageSize=1");

    expect(data.page).toBe(1);
    expect(data.pageSize).toBe(1);
    expect(data.total).toBeGreaterThan(0);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].fullName).toContain("Alek");
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

  it("creates customer inline", async () => {
    const before = await getJson("/api/customers?page=1&pageSize=50");
    const created = await postJson("/api/customers", {
      fullName: "Egor Stepanov",
      phone: "+7 (999) 555-01-99",
      email: "egor.stepanov@example.by",
      loyaltyTier: "silver",
    });
    const after = await getJson("/api/customers?page=1&pageSize=50");

    expect(created.status).toBe(201);
    expect(created.body.fullName).toBe("Egor Stepanov");
    expect(after.total).toBe(before.total + 1);
  });

  it("updates customer", async () => {
    const updated = await patchJson("/api/customers/cust_001", {
      fullName: "Aleksey Volkov Updated",
      phone: "+7 (902) 555-01-01",
      email: "aleksey.volkov.updated@example.ru",
      loyaltyTier: "gold",
    });
    const details = await getJson("/api/customers/cust_001");

    expect(updated.status).toBe(200);
    expect(updated.body.fullName).toBe("Aleksey Volkov Updated");
    expect(details.customer.fullName).toBe("Aleksey Volkov Updated");
    expect(details.customer.loyaltyTier).toBe("gold");
  });
});
