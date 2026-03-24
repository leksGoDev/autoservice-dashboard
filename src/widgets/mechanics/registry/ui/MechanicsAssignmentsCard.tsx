import type { MechanicWorkloadItem } from "@/entities/mechanic/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";

type MechanicsAssignmentsCardProps = {
  leaders: MechanicWorkloadItem[];
};

export const MechanicsAssignmentsCard = ({ leaders }: MechanicsAssignmentsCardProps) => {
  const { t } = useI18n();

  return (
    <WidgetCard
      title={t("pages.mechanics.assignments.title")}
      description={t("pages.mechanics.assignments.description")}
    >
      <ul className="m-0 grid list-none gap-2 p-0">
        {leaders.map((item) => (
          <li
            key={item.mechanicId}
            className="flex items-center justify-between rounded-lg border border-[rgba(154,164,178,0.16)] px-3 py-2"
          >
            <span className="text-[13px]">{item.mechanicName}</span>
            <span className="text-[12px] text-[var(--color-text-secondary)]">
              {t("pages.mechanics.assignments.orders", {
                count: item.assignedOrders,
                utilization: item.utilization,
              })}
            </span>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
};
