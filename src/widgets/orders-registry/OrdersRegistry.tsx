import type { OrdersToolbarFilters } from "@/widgets/orders-shared/model/types";
import type { OrdersTableRow } from "@/widgets/orders-shared/model/types";
import { OrdersToolbar } from "@/widgets/orders-toolbar/OrdersToolbar";
import { OrdersRegistryContent } from "./ui/OrdersRegistryContent";
import { OrdersRegistryHeader } from "./ui/OrdersRegistryHeader";

type OrdersRegistryProps = {
  filters: OrdersToolbarFilters;
  mechanics: string[];
  rows: OrdersTableRow[];
  page: number;
  total: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onToolbarChange: (next: Partial<OrdersToolbarFilters>) => void;
  onResetFilters: () => void;
  onPageChange: (nextPage: number) => void;
  onRetry: () => void;
};

export const OrdersRegistry = ({
  filters,
  mechanics,
  rows,
  page,
  total,
  totalPages,
  isLoading,
  isError,
  isFetching,
  onToolbarChange,
  onResetFilters,
  onPageChange,
  onRetry,
}: OrdersRegistryProps) => {
  return (
    <section className="grid gap-5">
      <OrdersRegistryHeader />

      <OrdersToolbar filters={filters} mechanics={mechanics} onChange={onToolbarChange} onReset={onResetFilters} />

      <OrdersRegistryContent
        rows={rows}
        page={page}
        total={total}
        totalPages={totalPages}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        onPageChange={onPageChange}
        onRetry={onRetry}
      />
    </section>
  );
};
