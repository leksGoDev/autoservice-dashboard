import type { FormEvent } from "react";

import { DASHBOARD_RANGES } from "@/shared/api/constants";
import { useI18n } from "@/shared/i18n/use-i18n";

type MechanicsRegistryHeaderProps = {
  range: (typeof DASHBOARD_RANGES)[number];
  searchInput: string;
  onRangeChange: (value: (typeof DASHBOARD_RANGES)[number]) => void;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const rangeButtonClass =
  "cursor-pointer rounded-full border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-2.5 py-1.5 text-xs font-bold tracking-[0.04em] text-[var(--color-text-secondary)] transition-colors";
const activeRangeButtonClass =
  "border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.2)] text-[var(--color-text-primary)]";

export const MechanicsRegistryHeader = ({
  range,
  searchInput,
  onRangeChange,
  onSearchInputChange,
  onSearchSubmit,
}: MechanicsRegistryHeaderProps) => {
  const { t } = useI18n();

  return (
    <header className="grid gap-[10px] rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
      <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
        {t("pages.mechanics.eyebrow")}
      </span>
      <h1 className="m-0 text-[28px] leading-[1.15]">{t("pages.mechanics.title")}</h1>
      <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.mechanics.description")}</p>

      <form className="mt-2 grid items-end gap-[10px] md:grid-cols-[minmax(260px,1fr)_auto]" onSubmit={onSearchSubmit}>
        <label
          htmlFor="mechanics-search"
          className="text-[12px] font-semibold text-[var(--color-text-secondary)] md:col-span-full"
        >
          {t("pages.mechanics.searchLabel")}
        </label>
        <input
          id="mechanics-search"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-3 py-2.5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          placeholder={t("pages.mechanics.searchPlaceholder")}
        />
        <button
          type="submit"
          className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.2)] px-3 py-2.5 text-[13px] font-semibold text-[var(--color-text-primary)]"
        >
          {t("pages.mechanics.searchButton")}
        </button>
      </form>

      <div className="mt-1 flex gap-2">
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
