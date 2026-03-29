import { useI18n } from "@/shared/i18n/use-i18n";
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
            className="inline-flex h-9 items-center justify-center cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 text-xs leading-4 font-medium text-[var(--color-text-primary)]"
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
