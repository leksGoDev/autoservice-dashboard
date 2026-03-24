import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type { WorkBoardData } from "../model/types";

export function getWorkBoardData() {
  return httpRequest<WorkBoardData>(apiEndpoints.workBoard.board, {
    method: "GET",
  });
}
