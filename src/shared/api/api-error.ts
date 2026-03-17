import { DEFAULT_API_ERROR_MESSAGE } from "./messages";

export interface ApiErrorPayload {
  code?: string;
  details?: unknown;
  message?: string;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = payload?.code;
    this.details = payload?.details;
  }

  static fromResponse(status: number, payload?: unknown): ApiError {
    if (payload && typeof payload === "object") {
      const apiPayload = payload as ApiErrorPayload;
      return new ApiError(status, apiPayload.message ?? DEFAULT_API_ERROR_MESSAGE, apiPayload);
    }

    return new ApiError(status, DEFAULT_API_ERROR_MESSAGE);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
