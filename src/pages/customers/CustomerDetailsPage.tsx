import { useCustomerDetailsPageModel } from "@/pages/customers/model/use-customer-details-page-model";
import { CustomerDetailsOverview } from "@/widgets/customer-details/CustomerDetailsOverview";

export const CustomerDetailsPage = () => {
  const { customerId } = useCustomerDetailsPageModel();
  return <CustomerDetailsOverview customerId={customerId} />;
};
