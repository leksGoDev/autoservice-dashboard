import { OrderDetailsOverview } from "@/widgets/orders/details/OrderDetailsOverview";
import { useOrderDetailsPageModel } from "./model/use-order-details-model";

export const OrderDetailsPage = () => {
  const { orderId } = useOrderDetailsPageModel();
  return <OrderDetailsOverview orderId={orderId} />;
};
