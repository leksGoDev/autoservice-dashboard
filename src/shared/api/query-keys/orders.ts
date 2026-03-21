import {
  DEFAULT_LIST_PAGE,
  DEFAULT_LIST_PAGE_SIZE,
  DEFAULT_ORDERS_SORT_BY,
  DEFAULT_ORDERS_SORT_DIRECTION,
} from "../constants";
import type { OrdersListParamsKey } from "./types";

function normalizeOrdersParams(params: OrdersListParamsKey = {}) {
  return {
    page: params.page ?? DEFAULT_LIST_PAGE,
    pageSize: params.pageSize ?? DEFAULT_LIST_PAGE_SIZE,
    search: params.search ?? "",
    sortBy: params.sortBy ?? DEFAULT_ORDERS_SORT_BY,
    sortDirection: params.sortDirection ?? DEFAULT_ORDERS_SORT_DIRECTION,
    status: params.status ?? "",
    priority: params.priority ?? "",
    assignedMechanic: params.assignedMechanic ?? "",
    createdFrom: params.createdFrom ?? "",
    createdTo: params.createdTo ?? "",
  };
}

export const ordersQueryKeys = {
  root: ["orders"] as const,
  list: (params: OrdersListParamsKey = {}) => ["orders", "list", normalizeOrdersParams(params)] as const,
} as const;
