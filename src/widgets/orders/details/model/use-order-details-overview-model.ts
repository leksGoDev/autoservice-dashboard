import { useOrderActivityQuery, useOrderDetailsQuery } from "@/entities/order/api/queries";
import { isApiError } from "@/shared/api/api-error";

function hasNotFoundError(error: unknown) {
  return isApiError(error) && error.status === 404;
}

export const useOrderDetailsOverviewModel = (orderId: string | undefined) => {
  const detailsQuery = useOrderDetailsQuery(orderId);
  const activityQuery = useOrderActivityQuery(orderId);

  const isNotFound = hasNotFoundError(detailsQuery.error);
  const isError = detailsQuery.isError && !isNotFound;
  const isActivityLoading = activityQuery.isLoading;
  const isActivityError = activityQuery.isError;
  const order = detailsQuery.data;
  const activity = activityQuery.data ?? [];

  return {
    order,
    activity,
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
