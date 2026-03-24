import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type { ListResponse } from "@/shared/api/types";
import type { OrderActivityItem, OrderDetails, OrderListItem, OrdersListParams } from "../model/types";

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

export function getOrderDetails(orderId: string) {
  return httpRequest<OrderDetails>(apiEndpoints.orders.detail(orderId), {
    method: "GET",
  });
}

export function getOrderActivity(orderId: string) {
  return httpRequest<OrderActivityItem[]>(apiEndpoints.orders.activity(orderId), {
    method: "GET",
  });
}
