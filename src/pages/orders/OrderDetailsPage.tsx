import { OrderDetailsOverview } from "@/widgets/order-details/OrderDetailsOverview";
import { useOrderDetailsPageModel } from "./model/use-order-details-page-model";

export const OrderDetailsPage = () => {
  const { orderId } = useOrderDetailsPageModel();
  return <OrderDetailsOverview orderId={orderId} />;
};
