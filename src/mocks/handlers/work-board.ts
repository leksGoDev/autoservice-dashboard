import { delay, http, HttpResponse } from "msw";

import { workBoardFixture } from "@/mocks/fixtures/work-board";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";

export const workBoardHandlers = [
  http.get(toMswPath(apiEndpoints.workBoard.board), async () => {
    await delay(250);
    return HttpResponse.json(workBoardFixture);
  }),
];
