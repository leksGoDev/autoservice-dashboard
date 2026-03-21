import { DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from "../constants";
import type { CustomersListParamsKey } from "./types";

function normalizeCustomersParams(params: CustomersListParamsKey = {}) {
  return {
    page: params.page ?? DEFAULT_LIST_PAGE,
    pageSize: params.pageSize ?? DEFAULT_LIST_PAGE_SIZE,
    search: params.search ?? "",
  };
}

export const customersQueryKeys = {
  root: ["customers"] as const,
  list: (params: CustomersListParamsKey = {}) => ["customers", "list", normalizeCustomersParams(params)] as const,
} as const;
