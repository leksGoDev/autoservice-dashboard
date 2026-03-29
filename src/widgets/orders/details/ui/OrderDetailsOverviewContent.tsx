import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { useOrderDetailsOverviewModel } from "../hooks/use-order-details-model";
import { OrderDetailsContent } from "./OrderDetailsContent";
import { OrderDetailsHeader } from "./OrderDetailsHeader";

type OrderDetailsOverviewContentProps = {
  orderId: string | undefined;
};

export const OrderDetailsOverviewContent = ({ orderId }: OrderDetailsOverviewContentProps) => {
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
            className="inline-flex h-9 items-center justify-center cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 text-xs leading-4 font-medium text-[var(--color-text-primary)]"
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
        mechanics={model.mechanics}
        activity={model.activity}
        isActivityLoading={model.isActivityLoading}
        isActivityError={model.isActivityError}
        onRetryActivity={model.refetchActivity}
      />
    </>
  );
};
