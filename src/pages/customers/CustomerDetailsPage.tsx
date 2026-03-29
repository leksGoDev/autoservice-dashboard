import { useCustomerDetailsPageModel } from "@/pages/customers/model/use-customer-details-model";
import { CustomerDetailsOverview } from "@/widgets/customers/details/CustomerDetailsOverview";

export const CustomerDetailsPage = () => {
  const { customerId } = useCustomerDetailsPageModel();
  return <CustomerDetailsOverview customerId={customerId} />;
};
