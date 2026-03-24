import { mechanicsQueryKeys } from "./mechanics";

describe("mechanicsQueryKeys", () => {
  it("uses default params for registry", () => {
    expect(mechanicsQueryKeys.registry()).toEqual([
      "mechanics",
      "registry",
      {
        page: 1,
        pageSize: 10,
        search: "",
      },
    ]);
  });

  it("uses explicit range for workload", () => {
    expect(mechanicsQueryKeys.workload("7d")).toEqual(["mechanics", "workload", "7d"]);
  });
});
