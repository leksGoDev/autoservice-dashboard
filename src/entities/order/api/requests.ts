import { httpRequest } from "@/shared/api/http-client";
import type { ListResponse } from "@/shared/api/types";
import type { OrderListItem, OrdersListParams } from "../model/types";

export function getOrdersList(params: OrdersListParams = {}) {
  return httpRequest<ListResponse<OrderListItem>>("/orders", {
    method: "GET",
    query: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
      status: params.status,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
    },
  });
}
