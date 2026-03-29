import type { FormEvent } from "react";

import { useI18n } from "@/shared/i18n/use-i18n";

type VehiclesRegistryToolbarProps = {
  hasActiveSearch: boolean;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;
};

export const VehiclesRegistryToolbar = ({
  hasActiveSearch,
  searchInput,
  onSearchInputChange,
  onSubmit,
  onClearSearch,
}: VehiclesRegistryToolbarProps) => {
  const { t } = useI18n();

  return (
    <form className="mt-2 grid items-end gap-2.5 md:grid-cols-[minmax(260px,1fr)_auto_auto]" onSubmit={onSubmit}>
      <label htmlFor="vehicles-search" className="text-xs font-semibold text-[var(--color-text-secondary)] md:col-span-full">
        {t("pages.vehicles.searchLabel")}
      </label>
      <input
        id="vehicles-search"
        className="w-full rounded-xl border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
        value={searchInput}
        onChange={(event) => onSearchInputChange(event.target.value)}
        placeholder={t("pages.vehicles.searchPlaceholder")}
      />
      <button
        type="submit"
        className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.2)] px-3 py-2.5 text-[13px] font-semibold text-xs font-semibold text-[var(--color-text-primary)]"
      >
        {t("pages.vehicles.searchButton")}
      </button>
      {hasActiveSearch ? (
        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-3 py-2.5 text-[13px] font-semibold text-[var(--color-text-secondary)]"
          onClick={onClearSearch}
        >
          {t("pages.vehicles.clearSearch")}
        </button>
      ) : null}
    </form>
  );
};
