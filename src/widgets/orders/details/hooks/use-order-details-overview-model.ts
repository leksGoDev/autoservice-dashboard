import { useMechanicsRegistryQuery } from "@/entities/mechanic/api/queries";
import { useOrderActivityQuery, useOrderDetailsQuery } from "@/entities/order/api/queries";
import type { OrderActivityItem, OrderDetails } from "@/entities/order/model/types";
import { isApiError } from "@/shared/api/api-error";

function hasNotFoundError(error: unknown) {
  return isApiError(error) && error.status === 404;
}

export type OrderDetailsOverviewModel = {
  order: OrderDetails | undefined;
  activity: OrderActivityItem[];
  mechanics: string[];
  isLoading: boolean;
  isError: boolean;
  isNotFound: boolean;
  isActivityLoading: boolean;
  isActivityError: boolean;
  refetchAll: () => void;
  refetchActivity: () => void;
};

export const useOrderDetailsOverviewModel = (orderId: string | undefined): OrderDetailsOverviewModel => {
  const detailsQuery = useOrderDetailsQuery(orderId);
  const activityQuery = useOrderActivityQuery(orderId);
  const mechanicsQuery = useMechanicsRegistryQuery({
    page: 1,
    pageSize: 100,
  });

  const isNotFound = hasNotFoundError(detailsQuery.error);
  const isError = detailsQuery.isError && !isNotFound;
  const isActivityLoading = activityQuery.isLoading;
  const isActivityError = activityQuery.isError;
  const order = detailsQuery.data;
  const activity = activityQuery.data ?? [];
  const mechanics = [...new Set((mechanicsQuery.data?.items ?? []).map((item) => item.name))].sort((a, b) =>
    a.localeCompare(b),
  );

  return {
    order,
    activity,
    mechanics,
    isLoading: detailsQuery.isLoading,
    isError,
    isNotFound,
    isActivityLoading,
    isActivityError,
    refetchAll: () => {
      detailsQuery.refetch();
      activityQuery.refetch();
    },
    refetchActivity: () => {
      activityQuery.refetch();
    },
  };
};
