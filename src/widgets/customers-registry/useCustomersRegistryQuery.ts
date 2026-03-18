import { useQuery } from "@tanstack/react-query";

import { CUSTOMERS_REGISTRY_DATA } from "./mock-data";
import {
  CUSTOMERS_REGISTRY_PAGE_SIZE,
  filterCustomersRegistryRows,
  paginateCustomersRegistryRows,
} from "./model";

interface UseCustomersRegistryQueryParams {
  page: number;
  search: string;
}

const fetchCustomersRegistry = async (page: number, search: string) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 250);
  });

  const filtered = filterCustomersRegistryRows(CUSTOMERS_REGISTRY_DATA, search);
  return paginateCustomersRegistryRows(filtered, page, CUSTOMERS_REGISTRY_PAGE_SIZE);
};

export const useCustomersRegistryQuery = ({ page, search }: UseCustomersRegistryQueryParams) =>
  useQuery({
    queryKey: ["customers-registry", page, search],
    queryFn: () => fetchCustomersRegistry(page, search),
    placeholderData: (prev) => prev,
  });
