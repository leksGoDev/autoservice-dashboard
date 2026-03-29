import type { GlobalSearchResult } from "@/entities/search/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import type { GlobalSearchDropdownStatus } from "../hooks/use-global-search-model";
import { GlobalSearchResults } from "./GlobalSearchResults";

type GlobalSearchDropdownProps = {
  status: GlobalSearchDropdownStatus;
  items: GlobalSearchResult[];
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (item: GlobalSearchResult) => void;
  onRetry: () => void;
};

export const GlobalSearchDropdown = ({
  status,
  items,
  activeIndex,
  onHover,
  onSelect,
  onRetry,
}: GlobalSearchDropdownProps) => {
  const { t } = useI18n();

  if (status === "loading") {
    return <p className="px-2 py-2 text-sm text-[var(--color-text-secondary)]">{t("topbar.search.states.loading")}</p>;
  }

  if (status === "shortQuery") {
    return <p className="px-2 py-2 text-sm text-[var(--color-text-secondary)]">{t("topbar.search.states.minQuery")}</p>;
  }

  if (status === "error") {
    return (
      <div className="grid gap-2 px-2 py-2">
        <p className="text-sm text-[var(--color-text-secondary)]">{t("topbar.search.states.error")}</p>
        <button
          type="button"
          className="w-fit rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-text-primary)]"
          onClick={onRetry}
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  if (status === "empty") {
    return <p className="px-2 py-2 text-sm text-[var(--color-text-secondary)]">{t("topbar.search.states.empty")}</p>;
  }

  return (
    <>
      <GlobalSearchResults
        items={items}
        activeIndex={activeIndex}
        onHover={onHover}
        onSelect={onSelect}
      />
      <p className="px-2 pt-2 text-[11px] text-[var(--color-text-muted)]">{t("topbar.search.keyboardHint")}</p>
    </>
  );
};
