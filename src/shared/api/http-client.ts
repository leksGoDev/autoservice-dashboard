import { ApiError } from "./api-error";
import { API_PREFIX } from "./constants";

type PrimitiveValue = string | number | boolean;
type QueryValue = PrimitiveValue | PrimitiveValue[] | undefined | null;

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: Record<string, QueryValue>;
}

function buildQueryString(query: Record<string, QueryValue>): string {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value == null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function httpRequest<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { body, headers, query, ...init } = options;
  const url = `${API_PREFIX}${path}${query ? buildQueryString(query) : ""}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const parsedResponse = await parseResponse(response);

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, parsedResponse);
  }

  return parsedResponse as TResponse;
}
