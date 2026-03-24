import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import type { useOrderDetailsOverviewModel } from "../model/use-order-details-overview-model";
import { OrderDetailsContent } from "../OrderDetailsContent";
import { OrderDetailsHeader } from "../OrderDetailsHeader";

type OrderDetailsOverviewContentProps = {
  orderId: string | undefined;
  model: ReturnType<typeof useOrderDetailsOverviewModel>;
};

export const OrderDetailsOverviewContent = ({ orderId, model }: OrderDetailsOverviewContentProps) => {
  const { t } = useI18n();

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
      <>
        <OrderDetailsHeader orderId={orderId} />
        <DataState message={t("pages.orderDetails.states.empty")} />
      </>
    );
  }

  return (
    <>
      <OrderDetailsHeader orderId={model.order.id} />
      <OrderDetailsContent
        order={model.order}
        activity={model.activity}
        isActivityLoading={model.isActivityLoading}
        isActivityError={model.isActivityError}
        onRetryActivity={model.refetchActivity}
      />
    </>
  );
};
