import { vehiclesQueryKeys } from "./vehicles";

describe("vehiclesQueryKeys", () => {
  it("normalizes defaults so equivalent params produce stable keys", () => {
    const keyA = vehiclesQueryKeys.list({});
    const keyB = vehiclesQueryKeys.list({
      page: 1,
      pageSize: 10,
      search: "",
    });

    expect(keyA).toEqual(keyB);
  });

  it("includes explicit params in query key", () => {
    const key = vehiclesQueryKeys.list({
      page: 3,
      pageSize: 20,
      search: "tesla",
    });

    expect(key).toEqual([
      "vehicles",
      "list",
      {
        page: 3,
        pageSize: 20,
        search: "tesla",
      },
    ]);
  });
});
