import type { UseQueryResult } from "@tanstack/react-query";
import { useWorkBoardQuery } from "@/entities/work-board/api/queries";
import type { WorkBoardData } from "@/entities/work-board/model/types";

export type WorkBoardOverviewModel = {
  boardQuery: UseQueryResult<WorkBoardData, Error>;
};

export const useWorkBoardOverviewModel = (): WorkBoardOverviewModel => {
  return {
    boardQuery: useWorkBoardQuery(),
  };
};
