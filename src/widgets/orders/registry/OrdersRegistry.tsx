import { OrdersToolbar } from "@/widgets/orders/toolbar/OrdersToolbar";
import { useOrdersRegistryModel } from "./hooks/use-orders-registry-model";
import { OrdersRegistryContent } from "./ui/OrdersRegistryContent";
import { OrdersRegistryHeader } from "./ui/OrdersRegistryHeader";

export const OrdersRegistry = () => {
  const model = useOrdersRegistryModel();

  return (
    <section className="grid gap-5">
      <OrdersRegistryHeader />

      <OrdersToolbar
        filters={model.filters}
        mechanics={model.mechanics}
        onChange={model.onToolbarChange}
        onReset={model.onResetFilters}
      />

      <OrdersRegistryContent model={model} />
    </section>
  );
};
