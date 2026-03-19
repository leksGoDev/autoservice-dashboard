import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/query-keys";
import type { CustomersListParams } from "../model/types";
import { getCustomersList } from "./requests";

export function useCustomersListQuery(params: CustomersListParams = {}) {
  return useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: () => getCustomersList(params),
    placeholderData: (previousData) => previousData,
  });
}
