import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";

type MechanicsAvailabilityCardProps = {
  counts: {
    available: number;
    busy: number;
    off_shift: number;
  };
  averageUtilization: number;
};

export const MechanicsAvailabilityCard = ({ counts, averageUtilization }: MechanicsAvailabilityCardProps) => {
  const { t } = useI18n();

  return (
    <WidgetCard
      title={t("pages.mechanics.availability.title")}
      description={t("pages.mechanics.availability.description")}
    >
      <div className="grid gap-2 text-[13px] text-[var(--color-text-secondary)]">
        <p className="m-0">{t("pages.mechanics.availability.available", { count: counts.available })}</p>
        <p className="m-0">{t("pages.mechanics.availability.busy", { count: counts.busy })}</p>
        <p className="m-0">{t("pages.mechanics.availability.offShift", { count: counts.off_shift })}</p>
        <p className="m-0 text-[var(--color-text-primary)]">
          {t("pages.mechanics.availability.utilization", { percent: averageUtilization })}
        </p>
      </div>
    </WidgetCard>
  );
};
