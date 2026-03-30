import { useState } from "react";

import { useCustomerDetailsOverviewModel } from "./hooks/use-customer-details-model";
import { CustomerDetailsHeader } from "./ui/CustomerDetailsHeader";
import { CustomerDetailsOverviewContent } from "./ui/CustomerDetailsOverviewContent";

type CustomerDetailsOverviewProps = {
  customerId: string | undefined;
};

export const CustomerDetailsOverview = ({ customerId }: CustomerDetailsOverviewProps) => {
  const model = useCustomerDetailsOverviewModel(customerId);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="grid gap-5">
      <CustomerDetailsHeader customerId={customerId} />
      <CustomerDetailsOverviewContent
        model={model}
        isEditing={isEditing}
        onStartEdit={() => setIsEditing(true)}
        onCancelEdit={() => setIsEditing(false)}
        onEditSubmitted={() => setIsEditing(false)}
      />
    </section>
  );
};
