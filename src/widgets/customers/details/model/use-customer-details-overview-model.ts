import { useCustomerDetailsQuery } from "@/entities/customer/api/queries";
import type { UseQueryResult } from "@tanstack/react-query";
import type { CustomerDetailsResponse } from "@/entities/customer/model/types";

export type CustomerDetailsOverviewModel = {
  query: UseQueryResult<CustomerDetailsResponse, Error>;
  details: CustomerDetailsResponse | undefined;
  vehicles: CustomerDetailsResponse["vehicles"];
  orders: CustomerDetailsResponse["orders"];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
};

export const useCustomerDetailsOverviewModel = (
  customerId: string | undefined,
): CustomerDetailsOverviewModel => {
  const query = useCustomerDetailsQuery(customerId);
  const details = query.data;
  const isLoading = query.isLoading;
  const isError = query.isError;
  const isEmpty = !isLoading && !isError && !details;

  return {
    query,
    details,
    vehicles: details?.vehicles ?? [],
    orders: details?.orders ?? [],
    isLoading,
    isError,
    isEmpty,
  };
};
