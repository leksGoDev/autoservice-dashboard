import { useI18n } from "@/shared/i18n/use-i18n";
import { primaryActionButtonClassName } from "@/shared/ui/class-names";
import { DataState } from "@/shared/ui/DataState";
import type { CustomerDetailsOverviewModel } from "../hooks/use-customer-details-model";
import { CustomerInfoCard } from "./CustomerInfoCard";
import { CustomerOrdersTable } from "./CustomerOrdersTable";
import { CustomerVehiclesTable } from "./CustomerVehiclesTable";

type CustomerDetailsOverviewContentProps = {
  model: CustomerDetailsOverviewModel;
};

export const CustomerDetailsOverviewContent = ({ model }: CustomerDetailsOverviewContentProps) => {
  const { t } = useI18n();

  if (model.isLoading) {
    return <DataState message={t("pages.customerDetails.states.loading")} />;
  }

  if (model.isError) {
    return (
      <DataState
        tone="error"
        message={t("pages.customerDetails.states.error")}
        action={
          <button
            type="button"
            className={primaryActionButtonClassName}
            onClick={() => model.query.refetch()}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (model.isEmpty || !model.details) {
    return <DataState message={t("pages.customerDetails.states.empty")} />;
  }

  return (
    <div className="grid gap-4">
      <CustomerInfoCard customer={model.details.customer} />
      <CustomerVehiclesTable rows={model.vehicles} />
      <CustomerOrdersTable rows={model.orders} />
    </div>
  );
};
