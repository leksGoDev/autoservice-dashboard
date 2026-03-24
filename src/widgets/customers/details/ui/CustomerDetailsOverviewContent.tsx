import type { CustomerDetailsResponse } from "@/entities/customer/model/types";
import {
  formatCustomerDetailsCurrency,
  formatCustomerDetailsDate,
} from "@/entities/customer/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { CustomerInfoCard } from "./CustomerInfoCard";
import { CustomerOrdersTable } from "./CustomerOrdersTable";
import { CustomerVehiclesTable } from "./CustomerVehiclesTable";

type CustomerDetailsOverviewContentProps = {
  details: CustomerDetailsResponse | undefined;
  vehicles: CustomerDetailsResponse["vehicles"];
  orders: CustomerDetailsResponse["orders"];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRetry: () => void;
  locale: string;
};

export const CustomerDetailsOverviewContent = ({
  details,
  vehicles,
  orders,
  isLoading,
  isError,
  isEmpty,
  onRetry,
  locale,
}: CustomerDetailsOverviewContentProps) => {
  const { t } = useI18n();

  if (isLoading) {
    return <DataState message={t("pages.customerDetails.states.loading")} />;
  }

  if (isError) {
    return (
      <DataState
        tone="error"
        message={t("pages.customerDetails.states.error")}
        action={
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
            onClick={onRetry}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (isEmpty || !details) {
    return <DataState message={t("pages.customerDetails.states.empty")} />;
  }

  return (
    <div className="grid gap-4">
      <CustomerInfoCard
        customer={details.customer}
        sectionTitle={t("pages.customerDetails.sections.info")}
        labels={{
          fullName: t("pages.customerDetails.labels.fullName"),
          phone: t("pages.customerDetails.labels.phone"),
          email: t("pages.customerDetails.labels.email"),
          loyaltyTier: t("pages.customerDetails.labels.loyaltyTier"),
          vehiclesCount: t("pages.customerDetails.labels.vehiclesCount"),
          ordersCount: t("pages.customerDetails.labels.ordersCount"),
          lastVisit: t("pages.customerDetails.labels.lastVisit"),
        }}
        loyaltyTierLabel={t(`customer.loyaltyTier.${details.customer.loyaltyTier}`)}
        lastVisitLabel={formatCustomerDetailsDate(details.customer.lastVisitAt, locale, t("common.unknown"))}
      />

      <CustomerVehiclesTable
        sectionTitle={t("pages.customerDetails.sections.vehicles")}
        emptyLabel={t("pages.customerDetails.states.emptyVehicles")}
        rows={vehicles}
        headers={{
          plateNumber: t("pages.customerDetails.vehicles.plateNumber"),
          vin: t("pages.customerDetails.vehicles.vin"),
          make: t("pages.customerDetails.vehicles.make"),
          model: t("pages.customerDetails.vehicles.model"),
          year: t("pages.customerDetails.vehicles.year"),
        }}
      />

      <CustomerOrdersTable
        sectionTitle={t("pages.customerDetails.sections.orders")}
        emptyLabel={t("pages.customerDetails.states.emptyOrders")}
        rows={orders}
        headers={{
          order: t("pages.customerDetails.orders.order"),
          vehicle: t("pages.customerDetails.orders.vehicle"),
          status: t("pages.customerDetails.orders.status"),
          total: t("pages.customerDetails.orders.total"),
          updated: t("pages.customerDetails.orders.updated"),
        }}
        getOrderStatusLabel={(status) => t(`order.status.${status}`)}
        formatAmount={(amount) => formatCustomerDetailsCurrency(amount, locale)}
        formatUpdatedAt={(updatedAt) => formatCustomerDetailsDate(updatedAt, locale, t("common.unknown"))}
      />
    </div>
  );
};
