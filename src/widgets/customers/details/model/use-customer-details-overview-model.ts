import { useCustomerDetailsQuery } from "@/entities/customer/api/queries";

export const useCustomerDetailsOverviewModel = (customerId: string | undefined) => {
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
