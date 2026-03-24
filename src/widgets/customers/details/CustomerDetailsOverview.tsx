import type { CustomerDetailsResponse } from "@/entities/customer/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { useCustomerDetailsOverviewModel } from "./model/use-customer-details-overview-model";
import { CustomerDetailsHeader } from "./ui/CustomerDetailsHeader";
import { CustomerDetailsOverviewContent } from "./ui/CustomerDetailsOverviewContent";

type CustomerDetailsOverviewProps = {
  customerId: string | undefined;
};

export const CustomerDetailsOverview = ({ customerId }: CustomerDetailsOverviewProps) => {
  const { t, locale } = useI18n();
  const model = useCustomerDetailsOverviewModel(customerId);

  return (
    <section className="grid gap-5">
      <CustomerDetailsHeader
        eyebrow={t("pages.customerDetails.eyebrow")}
        title={t("pages.customerDetails.title")}
        description={t("pages.customerDetails.description")}
        customerIdLabel={t("pages.customerDetails.customerId", { customerId })}
        backLabel={t("pages.customerDetails.back")}
      />
      <CustomerDetailsOverviewContent
        details={model.details}
        vehicles={model.vehicles}
        orders={model.orders}
        isLoading={model.isLoading}
        isError={model.isError}
        isEmpty={model.isEmpty}
        onRetry={() => model.query.refetch()}
        locale={locale}
      />
    </section>
  );
};
