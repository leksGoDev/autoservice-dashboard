import { Link } from "react-router-dom";

import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { CustomerSection } from "./sections/CustomerSection";
import { InitialJobsSection } from "./sections/InitialJobsSection";
import { MetaSection } from "./sections/MetaSection";
import { ScheduleSection } from "./sections/ScheduleSection";
import { VehicleSection } from "./sections/VehicleSection";
import { useCreateOrderFormModel } from "../model/use-create-order-form-model";

export const CreateOrderForm = () => {
  const { t } = useI18n();
  const model = useCreateOrderFormModel();

  if (model.isBootstrapLoading) {
    return <DataState message={t("pages.ordersCreate.states.loading")} />;
  }

  if (model.hasBootstrapError) {
    return (
      <DataState
        message={t("pages.ordersCreate.states.error")}
        tone="error"
        action={
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
            onClick={model.refetchBootstrap}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  return (
    <form className="grid gap-5" onSubmit={model.submit}>
      <CustomerSection form={model.form} mode={model.customerMode} customers={model.customers} />
      <VehicleSection form={model.form} mode={model.vehicleMode} vehicles={model.vehicles} />
      <ScheduleSection form={model.form} />
      <MetaSection form={model.form} mechanics={model.mechanics} />
      <InitialJobsSection form={model.form} mechanics={model.mechanics} jobsFieldArray={model.jobsFieldArray} />

      {model.submitError ? (
        <DataState message={model.submitError} tone="error" />
      ) : null}

      {model.submitSuccess ? <DataState message={t("pages.ordersCreate.states.success")} /> : null}

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          to="/orders"
          className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(27,33,48,0.85)] px-4 py-2.5 text-sm"
        >
          {t("pages.ordersCreate.actions.cancel")}
        </Link>
        <button
          type="submit"
          disabled={model.isSubmitting}
          className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {model.isSubmitting ? t("pages.ordersCreate.actions.submitting") : t("pages.ordersCreate.actions.submit")}
        </button>
      </div>
    </form>
  );
};
