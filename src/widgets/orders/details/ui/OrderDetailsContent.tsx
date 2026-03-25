import type { OrderActivityItem, OrderDetails } from "@/entities/order/model/types";
import { OrderOperationsControls } from "@/features/order-operations/ui/OrderOperationsControls";
import { formatOrderCurrency, formatOrderDate, getOrderStatusChipModifier } from "@/entities/order/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { getPriorityBadgeClass, getStatusBadgeClass } from "@/shared/ui/status-badges";
import { OrderDetailsActivityTimeline } from "./OrderDetailsActivityTimeline";
import { OrderDetailsInfoList } from "./OrderDetailsInfoList";
import { OrderDetailsJobsTable } from "./OrderDetailsJobsTable";
import { OrderDetailsPartsTable } from "./OrderDetailsPartsTable";
import { OrderDetailsSection } from "./OrderDetailsSection";
import { getLoyaltyTierBadgeClass } from "../model/presentation";
import type { OrderDetailsInfoListItem } from "../model/types";

type OrderDetailsContentProps = {
  order: OrderDetails;
  mechanics: string[];
  activity: OrderActivityItem[];
  isActivityLoading?: boolean;
  isActivityError?: boolean;
  onRetryActivity?: () => void;
};

export const OrderDetailsContent = ({
  order,
  mechanics,
  activity,
  isActivityLoading,
  isActivityError,
  onRetryActivity,
}: OrderDetailsContentProps) => {
  const { t } = useI18n();

  const summaryItems: OrderDetailsInfoListItem[] = [
    { label: t("pages.orderDetails.summary.number"), value: order.number },
    {
      label: t("pages.orderDetails.summary.status"),
      value: (
        <span
          className={[
            "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
            getStatusBadgeClass(getOrderStatusChipModifier(order.status)),
          ].join(" ").trim()}
        >
          {t(`order.status.${order.status}`)}
        </span>
      ),
    },
    {
      label: t("pages.orderDetails.summary.priority"),
      value: (
        <span
          className={[
            "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold",
            getPriorityBadgeClass(order.priority),
          ].join(" ").trim()}
        >
          {t(`order.priority.${order.priority}`)}
        </span>
      ),
    },
    { label: t("pages.orderDetails.summary.created"), value: formatOrderDate(order.createdAt) },
    { label: t("pages.orderDetails.summary.mechanic"), value: order.assignedMechanic },
    { label: t("pages.orderDetails.summary.total"), value: formatOrderCurrency(order.totalAmount) },
    {
      label: t("pages.orderDetails.summary.flagged"),
      value: order.flagged ? t("pages.orderDetails.summary.flaggedYes") : t("pages.orderDetails.summary.flaggedNo"),
    },
  ];

  const customerItems: OrderDetailsInfoListItem[] = [
    { label: t("pages.orderDetails.customer.name"), value: order.customer.fullName },
    { label: t("pages.orderDetails.customer.phone"), value: order.customer.phone },
    { label: t("pages.orderDetails.customer.email"), value: order.customer.email },
    {
      label: t("pages.orderDetails.customer.loyalty"),
      value: (
        <span
          className={[
            "inline-flex w-fit rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
            getLoyaltyTierBadgeClass(order.customer.loyaltyTier),
          ].join(" ").trim()}
        >
          {t(`pages.orderDetails.customer.loyaltyTier.${order.customer.loyaltyTier}`)}
        </span>
      ),
    },
  ];

  const vehicleItems: OrderDetailsInfoListItem[] = [
    {
      label: t("pages.orderDetails.vehicle.makeModel"),
      value: `${order.vehicle.year} ${order.vehicle.make} ${order.vehicle.model}`,
    },
    { label: t("pages.orderDetails.vehicle.plate"), value: order.vehicle.plateNumber },
    { label: t("pages.orderDetails.vehicle.vin"), value: order.vehicle.vin },
    { label: t("pages.orderDetails.vehicle.vehicleId"), value: order.vehicle.id },
  ];

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <OrderDetailsSection title={t("pages.orderDetails.sections.summary")}>
          <div className="grid gap-4">
            <OrderDetailsInfoList items={summaryItems} />
            <div className="rounded-xl border border-[rgba(154,164,178,0.12)] bg-[rgba(15,17,21,0.42)] p-3">
              <OrderOperationsControls
                orderId={order.id}
                status={order.status}
                assignedMechanic={order.assignedMechanic}
                flagged={order.flagged}
                mechanics={mechanics}
                variant="details"
              />
            </div>
          </div>
        </OrderDetailsSection>

        <div className="grid gap-4">
          <OrderDetailsSection title={t("pages.orderDetails.sections.customer")}>
            <OrderDetailsInfoList items={customerItems} />
          </OrderDetailsSection>

          <OrderDetailsSection title={t("pages.orderDetails.sections.vehicle")}>
            <OrderDetailsInfoList items={vehicleItems} />
          </OrderDetailsSection>
        </div>
      </div>

      <OrderDetailsSection title={t("pages.orderDetails.sections.jobs")}>
        <OrderDetailsJobsTable orderId={order.id} jobs={order.jobs} mechanics={mechanics} />
      </OrderDetailsSection>

      <OrderDetailsSection title={t("pages.orderDetails.sections.parts")}>
        <OrderDetailsPartsTable orderId={order.id} jobs={order.jobs} parts={order.parts} />
      </OrderDetailsSection>

      <OrderDetailsSection title={t("pages.orderDetails.sections.activity")}>
        <OrderDetailsActivityTimeline
          items={activity}
          isLoading={isActivityLoading}
          isError={isActivityError}
          onRetry={onRetryActivity}
        />
      </OrderDetailsSection>
    </>
  );
};
