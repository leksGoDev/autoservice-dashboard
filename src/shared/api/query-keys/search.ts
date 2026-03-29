import { DEFAULT_GLOBAL_SEARCH_LIMIT } from "../constants";
import type { GlobalSearchParamsKey } from "./types";

function normalizeGlobalSearchParams(params: GlobalSearchParamsKey = {}) {
  return {
    query: params.query?.trim() ?? "",
    limit: params.limit ?? DEFAULT_GLOBAL_SEARCH_LIMIT,
  };
}

export const searchQueryKeys = {
  root: ["search"] as const,
  global: (params: GlobalSearchParamsKey = {}) => ["search", "global", normalizeGlobalSearchParams(params)] as const,
} as const;
