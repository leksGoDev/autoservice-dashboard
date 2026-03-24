import { analyticsQueryKeys } from "./analytics";

describe("analyticsQueryKeys", () => {
  it("uses default range for metrics and overview", () => {
    expect(analyticsQueryKeys.metrics()).toEqual(["analytics", "metrics", "30d"]);
    expect(analyticsQueryKeys.overview()).toEqual(["analytics", "overview", "30d"]);
  });

  it("uses explicit range for jobs by category", () => {
    expect(analyticsQueryKeys.jobsByCategory("90d")).toEqual(["analytics", "jobs-by-category", "90d"]);
  });
});
