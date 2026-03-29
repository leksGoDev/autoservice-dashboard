import type { GlobalSearchResult } from "./types";

export function getGlobalSearchResultPath(result: GlobalSearchResult): string {
  if (result.entityType === "order") {
    return `/orders/${result.entityId}`;
  }

  if (result.entityType === "customer") {
    return `/customers/${result.entityId}`;
  }

  return `/vehicles/${result.entityId}`;
}
