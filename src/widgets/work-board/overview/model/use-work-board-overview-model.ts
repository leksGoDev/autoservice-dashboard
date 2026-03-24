import { useWorkBoardQuery } from "@/entities/work-board/api/queries";

export const useWorkBoardOverviewModel = () => {
  return {
    boardQuery: useWorkBoardQuery(),
  };
};
