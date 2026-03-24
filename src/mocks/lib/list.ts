import { DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from "@/shared/api/constants";

type ListQueryParams = {
  page: number;
  pageSize: number;
  search: string;
};

type PaginatedResult<TItem> = {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function parseListQueryParams(url: URL): ListQueryParams {
  return {
    page: Number(url.searchParams.get("page") ?? String(DEFAULT_LIST_PAGE)),
    pageSize: Number(url.searchParams.get("pageSize") ?? String(DEFAULT_LIST_PAGE_SIZE)),
    search: (url.searchParams.get("search") ?? "").toLowerCase().trim(),
  };
}

export function paginateItems<TItem>(items: TItem[], page: number, pageSize: number): PaginatedResult<TItem> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const start = (safePage - 1) * safePageSize;

  return {
    items: items.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages,
  };
}
