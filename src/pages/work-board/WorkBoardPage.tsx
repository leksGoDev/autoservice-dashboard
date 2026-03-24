import { useWorkBoardQuery } from "@/entities/work-board/api/queries";
import { WorkBoardOverview } from "@/widgets/work-board-overview/WorkBoardOverview";

export const WorkBoardPage = () => {
  const boardQuery = useWorkBoardQuery();

  return <WorkBoardOverview boardQuery={boardQuery} />;
};
