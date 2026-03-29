import { useI18n } from "@/shared/i18n/use-i18n";
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
          className="inline-flex h-9 items-center justify-center cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 text-xs leading-4 font-medium text-[var(--color-text-primary)]"
          onClick={onRetry}
        >
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
