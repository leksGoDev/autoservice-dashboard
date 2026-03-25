import { ordersFixture } from "@/mocks/fixtures/orders";

async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
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

  it("returns order details payload", async () => {
    const data = await getJson("/api/orders/ord_001");

    expect(data.id).toBe("ord_001");
    expect(data.customer).toEqual(
      expect.objectContaining({
        id: "cust_001",
        fullName: "Alex Turner",
      }),
    );
    expect(data.vehicle).toEqual(
      expect.objectContaining({
        id: "veh_001",
        plateNumber: expect.any(String),
      }),
    );
    expect(data.jobs.length).toBeGreaterThan(0);
    expect(data.parts.length).toBeGreaterThan(0);
  });

  it("returns chronological order activity", async () => {
    const data = await getJson("/api/orders/ord_001/activity");

    expect(data.length).toBeGreaterThan(0);

    const timestamps = data.map((item: { timestamp: string }) => new Date(item.timestamp).getTime());
    const sorted = [...timestamps].sort((left, right) => right - left);

    expect(timestamps).toEqual(sorted);
  });

  it("updates order status and returns updated details/list snapshots", async () => {
    const patchResponse = await patchJson("/api/orders/ord_002/status", { status: "in_progress" });
    const details = await getJson("/api/orders/ord_002");
    const list = await getJson("/api/orders?search=ORD-1002&page=1&pageSize=1");

    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.status).toBe("in_progress");
    expect(details.status).toBe("in_progress");
    expect(list.items[0].status).toBe("in_progress");
  });

  it("updates assigned mechanic and keeps data consistent in details and work board cards", async () => {
    const patchResponse = await patchJson("/api/orders/ord_001", { assignedMechanic: "Nikolai Volkov" });
    const details = await getJson("/api/orders/ord_001");
    const workBoard = await getJson("/api/work-board");
    const boardCard = workBoard.columns
      .flatMap((column: { cards: { orderId: string; assignedMechanic: string }[] }) => column.cards)
      .find((card: { orderId: string }) => card.orderId === "ord_001");

    expect(patchResponse.status).toBe(200);
    expect(details.assignedMechanic).toBe("Nikolai Volkov");
    expect(boardCard?.assignedMechanic).toBe("Nikolai Volkov");
  });

  it("updates flag state via dedicated endpoint", async () => {
    const patchResponse = await patchJson("/api/orders/ord_003/flag", { flagged: false });
    const details = await getJson("/api/orders/ord_003");

    expect(patchResponse.status).toBe(200);
    expect(details.flagged).toBe(false);
  });

  it("returns validation errors for invalid mutation payload", async () => {
    const response = await patchJson("/api/orders/ord_001/status", { status: "invalid_status" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Invalid");
  });
});
