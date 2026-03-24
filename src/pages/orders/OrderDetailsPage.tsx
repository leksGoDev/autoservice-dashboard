import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { OrderDetailsContent } from "@/widgets/order-details/OrderDetailsContent";
import { OrderDetailsHeader } from "@/widgets/order-details/OrderDetailsHeader";
import { useOrderDetailsPageModel } from "./model/use-order-details-page-model";

export const OrderDetailsPage = () => {
  const { t } = useI18n();
  const {
    orderId,
    order,
    activity,
    isLoading,
    isError,
    isNotFound,
    isActivityLoading,
    isActivityError,
    refetchAll,
    refetchActivity,
  } = useOrderDetailsPageModel();

  if (isLoading) {
    return <DataState message={t("pages.orderDetails.states.loading")} />;
  }

  if (isError) {
    return (
      <DataState
        message={t("pages.orderDetails.states.error")}
        tone="error"
        action={
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
            onClick={refetchAll}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (isNotFound || !order) {
    return (
      <section className="grid gap-5">
        <OrderDetailsHeader orderId={orderId} />
        <DataState message={t("pages.orderDetails.states.empty")} />
      </section>
    );
  }

  return (
    <section className="grid gap-5">
      <OrderDetailsHeader orderId={order.id} />
      <OrderDetailsContent
        order={order}
        activity={activity}
        isActivityLoading={isActivityLoading}
        isActivityError={isActivityError}
        onRetryActivity={refetchActivity}
      />
    </section>
  );
};
