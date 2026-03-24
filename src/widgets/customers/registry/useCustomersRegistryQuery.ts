import { useCustomersListQuery } from "@/entities/customer/api/queries";
import { DEFAULT_LIST_PAGE_SIZE } from "@/shared/api/constants";

interface UseCustomersRegistryQueryParams {
  page: number;
  search: string;
}

export const useCustomersRegistryQuery = ({ page, search }: UseCustomersRegistryQueryParams) =>
  useCustomersListQuery({
    page,
    pageSize: DEFAULT_LIST_PAGE_SIZE,
    search: search || undefined,
  });
