async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

describe("dashboardHandlers", () => {
  it("returns INVALID_RANGE for invalid range", async () => {
    const data = await getJson("/api/dashboard/revenue?range=invalid");

    expect(data).toEqual({
      code: "INVALID_RANGE",
      message: "range must be one of: 7d, 30d, 90d",
    });
  });
});
