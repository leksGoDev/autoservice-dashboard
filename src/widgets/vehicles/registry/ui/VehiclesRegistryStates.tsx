import { useI18n } from "@/shared/i18n/use-i18n";
import { RotateCcw } from "lucide-react";
import { primaryActionButtonClassName } from "@/shared/ui/class-names";
import { DataState } from "@/shared/ui/DataState";

export const VehiclesLoadingState = () => {
  const { t } = useI18n();

  return (
    <section
      className="rounded-2xl border border-[rgba(154,164,178,0.18)] bg-[rgba(27,33,48,0.9)] px-4 py-4 text-[var(--color-text-secondary)]"
      aria-live="polite"
    >
      <div className="grid gap-2.5">
        <span>{t("pages.vehicles.loading")}</span>
        <div className="grid gap-2" role="presentation" aria-hidden>
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} className="block h-2.5 animate-pulse rounded-full bg-[rgba(154,164,178,0.2)]" />
          ))}
        </div>
      </div>
    </section>
  );
};

type VehiclesErrorStateProps = {
  onRetry: () => void;
};

export const VehiclesErrorState = ({ onRetry }: VehiclesErrorStateProps) => {
  const { t } = useI18n();

  return (
    <DataState
      tone="error"
      message={t("pages.vehicles.error")}
      action={
        <button
          type="button"
          className={`${primaryActionButtonClassName} gap-1.5`}
          onClick={onRetry}
        >
          <RotateCcw size={14} strokeWidth={2} aria-hidden className="shrink-0 opacity-90" />
          {t("common.retry")}
        </button>
      }
    />
  );
};

type VehiclesEmptyStateProps = {
  hasActiveSearch: boolean;
};

export const VehiclesEmptyState = ({ hasActiveSearch }: VehiclesEmptyStateProps) => {
  const { t } = useI18n();

  return (
    <section
      className="grid gap-2.5 rounded-2xl border border-[rgba(154,164,178,0.18)] bg-[rgba(27,33,48,0.9)] px-4 py-4 text-[var(--color-text-secondary)]"
      aria-live="polite"
    >
      <strong>{hasActiveSearch ? t("pages.vehicles.emptySearch") : t("pages.vehicles.empty")}</strong>
      <span>{t("pages.vehicles.emptyHint")}</span>
    </section>
  );
};
