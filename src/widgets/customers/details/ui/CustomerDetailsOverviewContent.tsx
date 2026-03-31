import { useMemo } from "react";
import { RotateCcw } from "lucide-react";

import { CustomerForm } from "@/features/customer-management/ui/CustomerForm";
import { useI18n } from "@/shared/i18n/use-i18n";
import { primaryActionButtonClassName } from "@/shared/ui/class-names";
import { DataState } from "@/shared/ui/DataState";
import type { CustomerDetailsOverviewModel } from "../hooks/use-customer-details-model";
import { CustomerInfoCard } from "./CustomerInfoCard";
import { CustomerOrdersTable } from "./CustomerOrdersTable";
import { CustomerVehiclesTable } from "./CustomerVehiclesTable";

type CustomerDetailsOverviewContentProps = {
  model: CustomerDetailsOverviewModel;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onEditSubmitted: () => void;
};

export const CustomerDetailsOverviewContent = ({
  model,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onEditSubmitted,
}: CustomerDetailsOverviewContentProps) => {
  const { t } = useI18n();
  const editInitialValues = useMemo(() => {
    if (!model.details) {
      return undefined;
    }

    return {
      fullName: model.details.customer.fullName,
      phone: model.details.customer.phone,
      email: model.details.customer.email,
      loyaltyTier: model.details.customer.loyaltyTier,
    };
  }, [model.details]);

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
            className={`${primaryActionButtonClassName} gap-1.5`}
            onClick={() => model.query.refetch()}
          >
            <RotateCcw size={14} strokeWidth={2} aria-hidden className="shrink-0 opacity-90" />
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
      <CustomerInfoCard customer={model.details.customer} onEdit={onStartEdit} />
      {isEditing ? (
        <CustomerForm
          mode="edit"
          customerId={model.details.customer.id}
          initialValues={editInitialValues}
          onSubmitted={onEditSubmitted}
          onCancel={onCancelEdit}
        />
      ) : null}
      <CustomerVehiclesTable rows={model.vehicles} />
      <CustomerOrdersTable rows={model.orders} />
    </div>
  );
};
