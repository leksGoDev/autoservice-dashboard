import type { UseQueryResult } from "@tanstack/react-query";
import type { WorkBoardData } from "@/entities/work-board/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { WorkBoardColumns } from "@/widgets/work-board-columns/WorkBoardColumns";

type WorkBoardOverviewContentProps = {
  boardQuery: UseQueryResult<WorkBoardData, Error>;
  columns: WorkBoardData["columns"];
  totalCards: number;
};

export const WorkBoardOverviewContent = ({ boardQuery, columns, totalCards }: WorkBoardOverviewContentProps) => {
  const { t } = useI18n();

  if (boardQuery.isLoading) {
    return <DataState message={t("pages.workBoard.states.loading")} />;
  }

  if (boardQuery.isError) {
    return (
      <DataState
        tone="error"
        message={t("pages.workBoard.states.error")}
        action={
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
            onClick={() => boardQuery.refetch()}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (!boardQuery.data || totalCards === 0) {
    return <DataState message={t("pages.workBoard.states.empty")} />;
  }

  return <WorkBoardColumns columns={columns} />;
};
