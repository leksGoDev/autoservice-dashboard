import { useI18n } from "@/shared/i18n/use-i18n";
import styles from "./GlobalSearchTopbar.module.css";
import { useGlobalSearchTopbarModel } from "./hooks/use-global-search-topbar-model";
import { GlobalSearchDropdown } from "./ui/GlobalSearchDropdown";

export const GlobalSearchTopbar = () => {
  const { t } = useI18n();
  const { rootRef, input, dropdown, results } = useGlobalSearchTopbarModel();

  return (
    <div ref={rootRef} className={`${styles.searchRoot} md:w-80`}>
      <input
        className="w-full rounded-xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.7)] px-3.5 py-3 text-[var(--color-text-primary)]"
        type="search"
        value={input.query}
        role="searchbox"
        placeholder={t("topbar.searchPlaceholder")}
        aria-label={t("topbar.searchAria")}
        aria-expanded={input.isExpanded}
        aria-controls="global-search-listbox"
        aria-activedescendant={input.activeOptionId}
        onChange={(event) => input.handleQueryChange(event.target.value)}
        onFocus={input.handleInputFocus}
        onKeyDown={input.handleKeyDown}
      />
      {dropdown.isVisible ? (
        <div id="global-search-listbox" role="listbox" className={styles.resultsPanel}>
          <GlobalSearchDropdown
            status={dropdown.status}
            items={results.items}
            activeIndex={results.activeIndex}
            onHover={results.setActiveIndex}
            onSelect={results.selectResult}
            onRetry={() => void dropdown.retry()}
          />
        </div>
      ) : null}
    </div>
  );
};
