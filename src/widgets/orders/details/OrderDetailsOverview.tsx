import { useOrderDetailsOverviewModel } from "./model/use-order-details-overview-model";
import { OrderDetailsOverviewContent } from "./ui/OrderDetailsOverviewContent";

type OrderDetailsOverviewProps = {
  orderId: string | undefined;
};

export const OrderDetailsOverview = ({ orderId }: OrderDetailsOverviewProps) => {
  const model = useOrderDetailsOverviewModel(orderId);

  return (
    <section className="grid gap-5">
      <OrderDetailsOverviewContent orderId={orderId} model={model} />
    </section>
  );
};
