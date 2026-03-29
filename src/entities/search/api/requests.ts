import { DEFAULT_GLOBAL_SEARCH_LIMIT } from "@/shared/api/constants";
import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type { GlobalSearchParams, GlobalSearchResponse } from "../model/types";

export function getGlobalSearchResults(params: GlobalSearchParams) {
  return httpRequest<GlobalSearchResponse>(apiEndpoints.search.global, {
    method: "GET",
    query: {
      query: params.query.trim(),
      limit: params.limit ?? DEFAULT_GLOBAL_SEARCH_LIMIT,
    },
  });
}
