import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/query-keys";
import type { OrdersListParams } from "../model/types";
import { getOrdersList } from "./requests";

export function useOrdersListQuery(params: OrdersListParams = {}) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => getOrdersList(params),
  });
}
