export type GlobalSearchResultEntity = "order" | "customer" | "vehicle";

export interface GlobalSearchResult {
  id: string;
  entityType: GlobalSearchResultEntity;
  entityId: string;
  title: string;
  subtitle: string;
  meta: string;
}

export interface GlobalSearchResponse {
  items: GlobalSearchResult[];
}

export interface GlobalSearchParams {
  query: string;
  limit?: number;
}
