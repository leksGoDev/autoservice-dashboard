import type { AnalyticsRange } from "@/entities/analytics/model/types";
import { DASHBOARD_RANGES } from "@/shared/api/constants";
import { useI18n } from "@/shared/i18n/use-i18n";

type AnalyticsOverviewHeaderProps = {
  range: AnalyticsRange;
  onRangeChange: (value: AnalyticsRange) => void;
};

const rangeButtonClass =
  "cursor-pointer rounded-full border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-2.5 py-1.5 text-xs font-bold tracking-[0.04em] text-[var(--color-text-secondary)] transition-colors";
const activeRangeButtonClass =
  "border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.2)] text-[var(--color-text-primary)]";

export const AnalyticsOverviewHeader = ({ range, onRangeChange }: AnalyticsOverviewHeaderProps) => {
  const { t } = useI18n();

  return (
    <header className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
      <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
        {t("pages.analytics.eyebrow")}
      </span>
      <h1 className="mb-2 mt-2.5 text-[28px] leading-[1.15]">{t("pages.analytics.title")}</h1>
      <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.analytics.description")}</p>
      <div className="mt-[14px] flex gap-2">
        {DASHBOARD_RANGES.map((value) => (
          <button
            key={value}
            type="button"
            className={[rangeButtonClass, value === range ? activeRangeButtonClass : ""].join(" ").trim()}
            onClick={() => onRangeChange(value)}
          >
            {value.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
};
