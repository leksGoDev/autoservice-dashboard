import { useI18n } from "@/shared/i18n/use-i18n";
import { CirclePlus } from "lucide-react";
import { headerPrimaryActionButtonClassName } from "@/shared/ui/class-names";
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-2.5">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
            {t("pages.vehicles.eyebrow")}
          </span>
          <h1 className="m-0 text-[28px] leading-[1.15]">{t("pages.vehicles.title")}</h1>
          <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.vehicles.description")}</p>
        </div>

        <button
          type="button"
          className={`${headerPrimaryActionButtonClassName} gap-1.5`}
          onClick={onToggleCreate}
        >
          {!isCreateOpen ? <CirclePlus size={14} strokeWidth={2} aria-hidden className="shrink-0 opacity-90" /> : null}
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
