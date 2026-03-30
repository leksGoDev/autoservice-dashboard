import { useI18n } from "@/shared/i18n/use-i18n";
import type { VehiclesRegistryModel } from "../hooks/use-vehicles-registry-model";
import { VehiclesRegistryToolbar } from "./VehiclesRegistryToolbar";

type VehiclesRegistryHeaderProps = {
  hasActiveSearch: VehiclesRegistryModel["hasActiveSearch"];
  searchInput: VehiclesRegistryModel["searchInput"];
  onSearchInputChange: VehiclesRegistryModel["setSearchInput"];
  onSubmit: VehiclesRegistryModel["handleSearchSubmit"];
  onClearSearch: VehiclesRegistryModel["handleClearSearch"];
  isCreateOpen: boolean;
  onToggleCreate: () => void;
};

export const VehiclesRegistryHeader = ({
  hasActiveSearch,
  searchInput,
  onSearchInputChange,
  onSubmit,
  onClearSearch,
  isCreateOpen,
  onToggleCreate,
}: VehiclesRegistryHeaderProps) => {
  const { t } = useI18n();

  return (
    <header className="grid gap-2.5 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
        {t("pages.vehicles.eyebrow")}
      </span>
      <h1 className="m-0 text-[28px] leading-[1.15]">{t("pages.vehicles.title")}</h1>
      <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.vehicles.description")}</p>
      <div>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.2)] px-3 text-xs leading-4 font-medium text-[var(--color-text-primary)]"
          onClick={onToggleCreate}
        >
          {isCreateOpen ? t("pages.vehicles.form.cancelAction") : t("pages.vehicles.actions.create")}
        </button>
      </div>

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
