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

  it("builds detail and service history keys", () => {
    expect(vehiclesQueryKeys.detail("veh_001")).toEqual(["vehicles", "detail", "veh_001"]);
    expect(vehiclesQueryKeys.serviceHistory("veh_001")).toEqual(["vehicles", "service-history", "veh_001"]);
  });
});
