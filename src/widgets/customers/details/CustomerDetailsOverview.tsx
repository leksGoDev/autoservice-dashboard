import { useCustomerDetailsOverviewModel } from "./hooks/use-customer-details-overview-model";
import { CustomerDetailsHeader } from "./ui/CustomerDetailsHeader";
import { CustomerDetailsOverviewContent } from "./ui/CustomerDetailsOverviewContent";

type CustomerDetailsOverviewProps = {
  customerId: string | undefined;
};

export const CustomerDetailsOverview = ({ customerId }: CustomerDetailsOverviewProps) => {
  const model = useCustomerDetailsOverviewModel(customerId);

  return (
    <section className="grid gap-5">
      <CustomerDetailsHeader customerId={customerId} />
      <CustomerDetailsOverviewContent model={model} />
    </section>
  );
};
