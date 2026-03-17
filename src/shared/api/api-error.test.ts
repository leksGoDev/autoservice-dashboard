import { DEFAULT_API_ERROR_MESSAGE } from "./messages";
import { ApiError, isApiError } from "./api-error";

describe("ApiError", () => {
  it("builds from object payload with message/code/details", () => {
    const payload = {
      message: "Request is invalid",
      code: "INVALID",
      details: { field: "page" },
    };

    const error = ApiError.fromResponse(422, payload);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(422);
    expect(error.message).toBe("Request is invalid");
    expect(error.code).toBe("INVALID");
    expect(error.details).toEqual({ field: "page" });
    expect(isApiError(error)).toBe(true);
  });

  it("falls back to default message for non-object payload", () => {
    const error = ApiError.fromResponse(500, "oops");

    expect(error.message).toBe(DEFAULT_API_ERROR_MESSAGE);
    expect(error.status).toBe(500);
    expect(error.code).toBeUndefined();
    expect(error.details).toBeUndefined();
  });
});
