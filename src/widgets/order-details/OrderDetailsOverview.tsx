import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { useOrderDetailsOverviewModel } from "./model/use-order-details-overview-model";
import { OrderDetailsContent } from "./OrderDetailsContent";
import { OrderDetailsHeader } from "./OrderDetailsHeader";

type OrderDetailsOverviewProps = {
  orderId: string | undefined;
};

export const OrderDetailsOverview = ({ orderId }: OrderDetailsOverviewProps) => {
  const { t } = useI18n();
  const model = useOrderDetailsOverviewModel(orderId);

  if (model.isLoading) {
    return <DataState message={t("pages.orderDetails.states.loading")} />;
  }

  if (model.isError) {
    return (
      <DataState
        message={t("pages.orderDetails.states.error")}
        tone="error"
        action={
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
            onClick={model.refetchAll}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (model.isNotFound || !model.order) {
    return (
      <section className="grid gap-5">
        <OrderDetailsHeader orderId={orderId} />
        <DataState message={t("pages.orderDetails.states.empty")} />
      </section>
    );
  }

  return (
    <section className="grid gap-5">
      <OrderDetailsHeader orderId={model.order.id} />
      <OrderDetailsContent
        order={model.order}
        activity={model.activity}
        isActivityLoading={model.isActivityLoading}
        isActivityError={model.isActivityError}
        onRetryActivity={model.refetchActivity}
      />
    </section>
  );
};
