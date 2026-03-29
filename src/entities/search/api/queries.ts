import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/query-keys";
import type { GlobalSearchParams } from "../model/types";
import { getGlobalSearchResults } from "./requests";

export function useGlobalSearchQuery(params: GlobalSearchParams | undefined) {
  const query = params?.query.trim() ?? "";
  const limit = params?.limit;

  return useQuery({
    queryKey: queryKeys.search.global({ query, limit }),
    queryFn: () => getGlobalSearchResults({ query, limit }),
    enabled: Boolean(params) && query.length > 0,
  });
}
