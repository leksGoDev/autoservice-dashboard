import { ApiError } from "./api-error";
import { httpRequest } from "./http-client";

describe("httpRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds query strings and skips nullish values", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await httpRequest<{ ok: boolean }>("/orders", {
      method: "GET",
      query: {
        page: 2,
        status: "scheduled",
        tags: ["urgent", "vip"],
        ignoredNull: null,
        ignoredUndefined: undefined,
      },
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toContain("/api/orders?");
    expect(url).toContain("page=2");
    expect(url).toContain("status=scheduled");
    expect(url).toContain("tags=urgent");
    expect(url).toContain("tags=vip");
    expect(url).not.toContain("ignoredNull");
    expect(url).not.toContain("ignoredUndefined");
  });

  it("parses JSON responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ value: 42 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const response = await httpRequest<{ value: number }>("/dashboard/metrics", {
      method: "GET",
    });

    expect(response).toEqual({ value: 42 });
  });

  it("parses text responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("ok", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      }),
    );

    const response = await httpRequest<string>("/health", { method: "GET" });

    expect(response).toBe("ok");
  });

  it("returns null for 204", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    const response = await httpRequest<null>("/orders/ord_001", { method: "DELETE" });

    expect(response).toBeNull();
  });

  it("throws ApiError for non-ok responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Bad request", code: "INVALID_QUERY" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(httpRequest("/orders", { method: "GET" })).rejects.toEqual(
      expect.objectContaining<ApiError>({
        name: "ApiError",
        status: 400,
        message: "Bad request",
        code: "INVALID_QUERY",
      }),
    );
  });
});
