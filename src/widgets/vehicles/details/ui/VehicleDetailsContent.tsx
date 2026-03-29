import { useI18n } from "@/shared/i18n/use-i18n";
import type { VehicleDetailsViewModel } from "../hooks/use-vehicle-details-model";
import { VehicleDetailsHistoryCard } from "./VehicleDetailsHistoryCard";
import { VehicleDetailsInfoCard } from "./VehicleDetailsInfoCard";

type VehicleDetailsContentProps = {
  model: VehicleDetailsViewModel;
};

export const VehicleDetailsContent = ({ model }: VehicleDetailsContentProps) => {
  const { t } = useI18n();

  if (model.isLoading) {
    return (
      <section className="rounded-2xl border border-[rgba(154,164,178,0.18)] bg-[rgba(27,33,48,0.9)] px-[18px] py-[18px] text-[var(--color-text-secondary)]">
        {t("pages.vehicleDetails.states.loading")}
      </section>
    );
  }

  if (model.isError) {
    return (
      <section className="grid gap-3 rounded-2xl border border-[rgba(239,68,68,0.4)] bg-[rgba(27,33,48,0.9)] px-[18px] py-[18px] text-[#fecaca]">
        <span>{t("pages.vehicleDetails.states.error")}</span>
        <button
          type="button"
          className="justify-self-start rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
          onClick={model.refetchAll}
        >
          {t("common.retry")}
        </button>
      </section>
    );
  }

  if (model.isEmpty) {
    return (
      <section className="rounded-2xl border border-[rgba(154,164,178,0.18)] bg-[rgba(27,33,48,0.9)] px-[18px] py-[18px] text-[var(--color-text-secondary)]">
        {t("pages.vehicleDetails.states.empty")}
      </section>
    );
  }

  if (!model.details) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(320px,1fr)_minmax(320px,1fr)]">
      <VehicleDetailsInfoCard details={model.details} />
      <VehicleDetailsHistoryCard history={model.history} />
    </div>
  );
};
