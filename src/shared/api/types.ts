export type SortDirection = "asc" | "desc";

export interface ListResponse<TItem> {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
