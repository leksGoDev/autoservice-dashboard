import { useOrdersPageModel } from "./model/use-orders-page-model";
import { OrdersRegistry } from "@/widgets/orders/registry/OrdersRegistry";

export const OrdersPage = () => {
  const model = useOrdersPageModel();

  return (
    <OrdersRegistry
      filters={model.filters}
      mechanics={model.mechanics}
      rows={model.rows}
      page={model.page}
      total={model.total}
      totalPages={model.totalPages}
      isLoading={model.listQuery.isLoading}
      isError={model.listQuery.isError}
      isFetching={model.listQuery.isFetching}
      onToolbarChange={model.onToolbarChange}
      onResetFilters={model.onResetFilters}
      onPageChange={model.onPageChange}
      onRetry={() => model.listQuery.refetch()}
    />
  );
};
