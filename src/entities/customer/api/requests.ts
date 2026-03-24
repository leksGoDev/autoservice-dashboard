import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type { ListResponse } from "@/shared/api/types";
import type { CustomerDetailsResponse, CustomerListItem, CustomersListParams } from "../model/types";

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

export function getCustomerDetails(customerId: string) {
  return httpRequest<CustomerDetailsResponse>(apiEndpoints.customers.detail(customerId), {
    method: "GET",
  });
}
