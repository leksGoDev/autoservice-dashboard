import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/query-keys";
import type { OrdersListParams } from "../model/types";
import { getOrderActivity, getOrderDetails, getOrdersList } from "./requests";

export function useOrdersListQuery(params: OrdersListParams = {}) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => getOrdersList(params),
  });
}

export function useOrderDetailsQuery(orderId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId ?? ""),
    queryFn: () => getOrderDetails(orderId ?? ""),
    enabled: Boolean(orderId),
  });
}

export function useOrderActivityQuery(orderId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.activity(orderId ?? ""),
    queryFn: () => getOrderActivity(orderId ?? ""),
    enabled: Boolean(orderId),
  });
}
