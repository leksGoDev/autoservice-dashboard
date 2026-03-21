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

  it("applies priority, mechanic and created date filters", async () => {
    const data = await getJson(
      "/api/orders?priority=high&assignedMechanic=Ivan%20Petrov&createdFrom=2026-03-01&createdTo=2026-03-31&page=1&pageSize=50",
    );

    expect(
      data.items.every(
        (item: { priority: string; assignedMechanic: string; createdAt: string }) =>
          item.priority === "high" &&
          item.assignedMechanic === "Ivan Petrov" &&
          new Date(item.createdAt).getTime() >= new Date("2026-03-01T00:00:00.000Z").getTime() &&
          new Date(item.createdAt).getTime() <= new Date("2026-03-31T23:59:59.999Z").getTime(),
      ),
    ).toBe(true);
  });
});
