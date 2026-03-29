import type { SortDirection } from "./types";

export const API_PREFIX = "/api";

export const DEFAULT_LIST_PAGE = 1;
export const DEFAULT_LIST_PAGE_SIZE = 10;
export const DEFAULT_ORDERS_SORT_BY = "createdAt";
export const DEFAULT_ORDERS_SORT_DIRECTION: SortDirection = "desc";

export const DEFAULT_DASHBOARD_RANGE = "30d";
export const DASHBOARD_RANGES = ["7d", "30d", "90d"] as const;
export const DEFAULT_DASHBOARD_RECENT_ORDERS_LIMIT = 5;
export const DEFAULT_GLOBAL_SEARCH_LIMIT = 12;
