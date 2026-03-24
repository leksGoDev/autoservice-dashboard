import { useWorkBoardOverviewModel } from "./model/use-work-board-overview-model";
import { WorkBoardOverviewContent } from "./ui/WorkBoardOverviewContent";
import { WorkBoardOverviewHeader } from "./ui/WorkBoardOverviewHeader";
import { WorkBoardOverviewSummary } from "./ui/WorkBoardOverviewSummary";

export const WorkBoardOverview = () => {
  const { boardQuery } = useWorkBoardOverviewModel();
  const columns = boardQuery.data?.columns ?? [];
  const totalCards = boardQuery.data?.totalCards ?? 0;

  return (
    <section className="grid gap-5">
      <WorkBoardOverviewHeader />
      <WorkBoardOverviewSummary totalCards={totalCards} totalColumns={columns.length} />
      <WorkBoardOverviewContent boardQuery={boardQuery} columns={columns} totalCards={totalCards} />
    </section>
  );
};
