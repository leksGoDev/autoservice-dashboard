import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type { ListResponse } from "@/shared/api/types";
import type { OrderListItem, OrdersListParams } from "../model/types";

export function getOrdersList(params: OrdersListParams = {}) {
  return httpRequest<ListResponse<OrderListItem>>(apiEndpoints.orders.list, {
    method: "GET",
    query: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
      status: params.status,
      priority: params.priority,
      assignedMechanic: params.assignedMechanic,
      createdFrom: params.createdFrom,
      createdTo: params.createdTo,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
    },
  });
}
