import { useParams } from "react-router-dom";

import { useCustomerDetailsQuery } from "@/entities/customer/api/queries";

export function useCustomerDetailsPageModel() {
  const { customerId } = useParams();
  const query = useCustomerDetailsQuery(customerId);

  const details = query.data;
  const isLoading = query.isLoading;
  const isError = query.isError;
  const isEmpty = !isLoading && !isError && !details;

  return {
    customerId,
    query,
    details,
    vehicles: details?.vehicles ?? [],
    orders: details?.orders ?? [],
    isLoading,
    isError,
    isEmpty,
  };
}
