import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { WorkBoardColumns } from "@/widgets/work-board/columns/WorkBoardColumns";
import type { WorkBoardOverviewModel } from "../hooks/use-work-board-model";

type WorkBoardOverviewContentProps = {
  boardQuery: WorkBoardOverviewModel["boardQuery"];
};

export const WorkBoardOverviewContent = ({ boardQuery }: WorkBoardOverviewContentProps) => {
  const { t } = useI18n();
  const columns = boardQuery.data?.columns ?? [];
  const totalCards = boardQuery.data?.totalCards ?? 0;

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
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-xs font-semibold text-[var(--color-text-primary)]"
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
