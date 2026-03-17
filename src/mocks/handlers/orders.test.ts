import { ordersFixture } from "@/mocks/fixtures/orders";

async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

describe("ordersHandlers", () => {
  it("filters by status, applies search, and paginates", async () => {
    const data = await getJson("/api/orders?status=in_progress&search=ORD-10&page=1&pageSize=2");

    expect(data.page).toBe(1);
    expect(data.pageSize).toBe(2);
    expect(data.total).toBeGreaterThan(0);
    expect(data.items).toHaveLength(2);
    expect(data.items.every((item: { status: string }) => item.status === "in_progress")).toBe(true);
  });

  it("sorts by totalAmount ascending", async () => {
    const data = await getJson("/api/orders?sortBy=totalAmount&sortDirection=asc&page=1&pageSize=50");

    const amounts = data.items.map((item: { totalAmount: number }) => item.totalAmount);
    const sorted = [...amounts].sort((a, b) => a - b);

    expect(amounts).toEqual(sorted);
    expect(data.total).toBe(ordersFixture.length);
  });

  it("guards invalid page and pageSize", async () => {
    const data = await getJson("/api/orders?page=0&pageSize=0");

    expect(data.page).toBe(1);
    expect(data.pageSize).toBe(1);
    expect(data.items).toHaveLength(1);
  });
});
