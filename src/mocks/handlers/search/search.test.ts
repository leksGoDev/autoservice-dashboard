export {};

async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

describe("searchHandlers", () => {
  it("returns grouped mixed results for global query", async () => {
    const data = await getJson("/api/search?query=alek&limit=20");
    const entityTypes = data.items.map((item: { entityType: string }) => item.entityType);

    expect(entityTypes).toContain("order");
    expect(entityTypes).toContain("customer");
    expect(entityTypes).toContain("vehicle");
  });

  it("returns empty items for blank query", async () => {
    const data = await getJson("/api/search?query=");

    expect(data).toEqual({ items: [] });
  });

  it("respects limit and clamps invalid values", async () => {
    const data = await getJson("/api/search?query=ord&limit=0");

    expect(data.items).toHaveLength(1);
  });
});
