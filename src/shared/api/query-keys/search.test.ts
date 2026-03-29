import { searchQueryKeys } from "./search";

describe("searchQueryKeys", () => {
  it("normalizes defaults for stable key generation", () => {
    const keyA = searchQueryKeys.global({});
    const keyB = searchQueryKeys.global({
      query: "",
      limit: 12,
    });

    expect(keyA).toEqual(keyB);
  });

  it("trims query and keeps explicit params", () => {
    const key = searchQueryKeys.global({
      query: "  Alex  ",
      limit: 5,
    });

    expect(key).toEqual([
      "search",
      "global",
      {
        query: "Alex",
        limit: 5,
      },
    ]);
  });
});
