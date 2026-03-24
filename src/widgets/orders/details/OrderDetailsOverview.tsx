import { OrderDetailsOverviewContent } from "./ui/OrderDetailsOverviewContent";

type OrderDetailsOverviewProps = {
  orderId: string | undefined;
};

export const OrderDetailsOverview = ({ orderId }: OrderDetailsOverviewProps) => {
  return (
    <section className="grid gap-5">
      <OrderDetailsOverviewContent orderId={orderId} />
    </section>
  );
};
