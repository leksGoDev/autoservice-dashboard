import type { VehicleDetails } from "@/entities/vehicle/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";

type VehicleDetailsInfoCardProps = {
  details: VehicleDetails;
};

export const VehicleDetailsInfoCard = ({ details }: VehicleDetailsInfoCardProps) => {
  const { t } = useI18n();

  return (
    <article className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4">
      <h2 className="m-0 text-base font-bold">{t("pages.vehicleDetails.sections.info")}</h2>
      <dl className="grid gap-3">
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {t("pages.vehicleDetails.labels.vehicleId")}
          </dt>
          <dd className="m-0">{details.id}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {t("pages.vehicleDetails.labels.plateNumber")}
          </dt>
          <dd className="m-0">{details.plateNumber}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {t("pages.vehicleDetails.labels.vin")}
          </dt>
          <dd className="m-0">{details.vin}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {t("pages.vehicleDetails.labels.makeModel")}
          </dt>
          <dd className="m-0">{`${details.make} ${details.model}`}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {t("pages.vehicleDetails.labels.year")}
          </dt>
          <dd className="m-0">{details.year}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {t("pages.vehicleDetails.labels.owner")}
          </dt>
          <dd className="m-0">{details.owner}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
            {t("pages.vehicleDetails.labels.ordersCount")}
          </dt>
          <dd className="m-0">{details.ordersCount}</dd>
        </div>
      </dl>
    </article>
  );
};
