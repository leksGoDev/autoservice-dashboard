import type { MechanicWorkloadItem } from "@/entities/dashboard/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { Link } from "react-router-dom";

import { WidgetCard } from "@/shared/ui/WidgetCard";
import { getVisibleMechanicWorkloadItems } from "./model/presentation";
import { MechanicWorkloadRow } from "./ui/MechanicWorkloadRow";

type DashboardMechanicWorkloadProps = {
  items: MechanicWorkloadItem[];
  compact?: boolean;
};

export const DashboardMechanicWorkload = ({ items, compact = false }: DashboardMechanicWorkloadProps) => {
  const { t } = useI18n();
  const visibleItems = getVisibleMechanicWorkloadItems(items, compact);
  const activeLabel = t("common.active");

  return (
    <WidgetCard
      title={t("dashboard.mechanicWorkload.title")}
      description={t("dashboard.mechanicWorkload.description")}
      className={compact ? "p-3" : undefined}
    >
      <ul className={["m-0 grid list-none p-0", compact ? "gap-2.5" : "gap-3"].join(" ")}>
        {visibleItems.map((item) => (
          <MechanicWorkloadRow key={item.mechanicId} item={item} compact={compact} activeLabel={activeLabel} />
        ))}
      </ul>
      {compact ? (
        <footer className="mt-2.5 flex items-center justify-between gap-3 text-xs text-[var(--color-text-secondary)]">
          <span>
            {t("dashboard.mechanicWorkload.summary", { shown: visibleItems.length, total: items.length })}
          </span>
          <Link to="/analytics" className="font-semibold text-[var(--color-accent-light-blue)] hover:underline">
            {t("dashboard.mechanicWorkload.openAnalytics")}
          </Link>
        </footer>
      ) : null}
    </WidgetCard>
  );
};
