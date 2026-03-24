import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/query-keys";
import { getWorkBoardData } from "./requests";

export function useWorkBoardQuery() {
  return useQuery({
    queryKey: queryKeys.workBoard.board(),
    queryFn: getWorkBoardData,
  });
}
