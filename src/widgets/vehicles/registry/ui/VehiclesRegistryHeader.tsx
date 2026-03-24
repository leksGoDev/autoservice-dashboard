import { useI18n } from "@/shared/i18n/use-i18n";
import type { VehiclesRegistryModel } from "../model/use-vehicles-registry-model";
import { VehiclesRegistryToolbar } from "./VehiclesRegistryToolbar";

type VehiclesRegistryHeaderProps = {
  hasActiveSearch: VehiclesRegistryModel["hasActiveSearch"];
  searchInput: VehiclesRegistryModel["searchInput"];
  onSearchInputChange: VehiclesRegistryModel["setSearchInput"];
  onSubmit: VehiclesRegistryModel["handleSearchSubmit"];
  onClearSearch: VehiclesRegistryModel["handleClearSearch"];
};

export const VehiclesRegistryHeader = ({
  hasActiveSearch,
  searchInput,
  onSearchInputChange,
  onSubmit,
  onClearSearch,
}: VehiclesRegistryHeaderProps) => {
  const { t } = useI18n();

  return (
    <header className="grid gap-[10px] rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
      <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
        {t("pages.vehicles.eyebrow")}
      </span>
      <h1 className="m-0 text-[28px] leading-[1.15]">{t("pages.vehicles.title")}</h1>
      <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.vehicles.description")}</p>

      <VehiclesRegistryToolbar
        hasActiveSearch={hasActiveSearch}
        searchInput={searchInput}
        onSearchInputChange={onSearchInputChange}
        onSubmit={onSubmit}
        onClearSearch={onClearSearch}
      />
    </header>
  );
};
