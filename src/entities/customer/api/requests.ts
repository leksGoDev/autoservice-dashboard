import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type { ListResponse } from "@/shared/api/types";
import type { CustomerListItem, CustomersListParams } from "../model/types";

export function getCustomersList(params: CustomersListParams = {}) {
  return httpRequest<ListResponse<CustomerListItem>>(apiEndpoints.customers.list, {
    method: "GET",
    query: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
    },
  });
}
