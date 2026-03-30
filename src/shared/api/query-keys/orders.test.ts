import { ordersQueryKeys } from "./orders";

describe("ordersQueryKeys", () => {
  it("normalizes defaults so equivalent params produce stable keys", () => {
    const keyA = ordersQueryKeys.list({});
    const keyB = ordersQueryKeys.list({
      page: 1,
      pageSize: 10,
      search: "",
      sortBy: "createdAt",
      sortDirection: "desc",
      status: "",
      priority: "",
      assignedMechanic: "",
      createdFrom: "",
      createdTo: "",
    });

    expect(keyA).toEqual(keyB);
  });

  it("includes explicit params in query key", () => {
    const key = ordersQueryKeys.list({
      page: 3,
      pageSize: 20,
      search: "ford",
      sortBy: "updatedAt",
      sortDirection: "asc",
      status: "waiting_parts",
      priority: "high",
      assignedMechanic: "Artem Bondar",
      createdFrom: "2026-03-01",
      createdTo: "2026-03-31",
    });

    expect(key).toEqual([
      "orders",
      "list",
      {
        page: 3,
        pageSize: 20,
        search: "ford",
        sortBy: "updatedAt",
        sortDirection: "asc",
        status: "waiting_parts",
        priority: "high",
        assignedMechanic: "Artem Bondar",
        createdFrom: "2026-03-01",
        createdTo: "2026-03-31",
      },
    ]);
  });

  it("creates detail and activity keys", () => {
    expect(ordersQueryKeys.detail("ord_001")).toEqual(["orders", "detail", "ord_001"]);
    expect(ordersQueryKeys.activity("ord_001")).toEqual(["orders", "activity", "ord_001"]);
  });
});
