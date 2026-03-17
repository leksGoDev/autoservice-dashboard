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
      },
    ]);
  });
});
