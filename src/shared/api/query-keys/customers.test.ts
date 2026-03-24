import { customersQueryKeys } from "./customers";

describe("customersQueryKeys", () => {
  it("normalizes params for stable keys", () => {
    const keyA = customersQueryKeys.list({});
    const keyB = customersQueryKeys.list({
      page: 1,
      pageSize: 10,
      search: "",
    });

    expect(keyA).toEqual(keyB);
  });

  it("keeps explicit params in key", () => {
    const key = customersQueryKeys.list({
      page: 3,
      pageSize: 25,
      search: "alex",
    });

    expect(key).toEqual([
      "customers",
      "list",
      {
        page: 3,
        pageSize: 25,
        search: "alex",
      },
    ]);
  });

  it("builds detail key", () => {
    expect(customersQueryKeys.detail("cust_001")).toEqual(["customers", "detail", "cust_001"]);
  });
});
