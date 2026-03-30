import { getMechanicsRegistryFixture } from "@/mocks/fixtures/mechanics";

async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

describe("mechanicsHandlers", () => {
  it("filters mechanics registry by search query", async () => {
    const data = await getJson("/api/mechanics/registry?search=brake");

    expect(data.items).toHaveLength(1);
    expect(data.items[0].specialization).toBe("Brake Systems");
  });

  it("uses default range for mechanics workload", async () => {
    const data = await getJson("/api/mechanics/workload");

    expect(data).toHaveLength(6);
  });

  it("returns invalid range error for mechanics workload", async () => {
    const data = await getJson("/api/mechanics/workload?range=365d");

    expect(data).toEqual({
      code: "INVALID_RANGE",
      message: "range must be one of: 7d, 30d, 90d",
    });
  });

  it("paginates mechanics registry", async () => {
    const data = await getJson("/api/mechanics/registry?page=1&pageSize=2");

    expect(data.items).toHaveLength(2);
    expect(data.total).toBe(getMechanicsRegistryFixture().length);
  });
});
