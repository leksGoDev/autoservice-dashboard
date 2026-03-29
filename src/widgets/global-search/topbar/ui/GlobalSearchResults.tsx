import { useMemo } from "react";
import type { GlobalSearchResult, GlobalSearchResultEntity } from "@/entities/search/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import styles from "../GlobalSearchTopbar.module.css";

type GlobalSearchResultsProps = {
  items: GlobalSearchResult[];
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (item: GlobalSearchResult) => void;
};

const groupOrder: GlobalSearchResultEntity[] = ["order", "customer", "vehicle"];

export const GlobalSearchResults = ({
  items,
  activeIndex,
  onHover,
  onSelect,
}: GlobalSearchResultsProps) => {
  const { t } = useI18n();
  const groupedItems = useMemo(() => {
    const groups: Record<GlobalSearchResultEntity, Array<{ item: GlobalSearchResult; index: number }>> = {
      order: [],
      customer: [],
      vehicle: [],
    };

    items.forEach((item, index) => {
      groups[item.entityType].push({ item, index });
    });

    return groups;
  }, [items]);

  return (
    <div className="grid gap-3">
      {groupOrder.map((groupType) => {
        const groupItems = groupedItems[groupType];

        if (groupItems.length === 0) {
          return null;
        }

        return (
          <section key={groupType} className="grid gap-1.5">
            <h3 className="px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              {t(`topbar.search.groups.${groupType}`)}
            </h3>
            <div className="grid gap-1">
              {groupItems.map(({ item, index }) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={item.id}
                    id={`global-search-option-${item.id}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={[
                      "grid w-full cursor-pointer gap-0.5 rounded-lg border border-transparent px-3 py-2 text-left transition-colors",
                      isActive ? styles.resultItemActive : "hover:bg-[rgba(154,164,178,0.1)]",
                    ].join(" ")}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => onHover(index)}
                    onClick={() => onSelect(item)}
                  >
                    <strong className="text-[13px] text-[var(--color-text-primary)]">{item.title}</strong>
                    <span className="text-xs text-[var(--color-text-secondary)]">{item.subtitle}</span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">{item.meta}</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
