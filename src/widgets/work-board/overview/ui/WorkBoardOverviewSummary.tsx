import { useI18n } from "@/shared/i18n/use-i18n";

type WorkBoardOverviewSummaryProps = {
  totalCards: number;
  totalColumns: number;
};

export const WorkBoardOverviewSummary = ({ totalCards, totalColumns }: WorkBoardOverviewSummaryProps) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-3 text-xs text-[var(--color-text-secondary)] md:grid-cols-2">
      <div className="rounded-xl border border-[rgba(154,164,178,0.2)] bg-[rgba(15,17,21,0.4)] px-3 py-2.5">
        {t("pages.workBoard.summary.totalOrders", { count: totalCards })}
      </div>
      <div className="rounded-xl border border-[rgba(154,164,178,0.2)] bg-[rgba(15,17,21,0.4)] px-3 py-2.5">
        {t("pages.workBoard.summary.columns", { count: totalColumns })}
      </div>
    </div>
  );
};
