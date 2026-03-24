import { workBoardQueryKeys } from "./work-board";

describe("workBoardQueryKeys", () => {
  it("returns stable root and board keys", () => {
    expect(workBoardQueryKeys.root).toEqual(["work-board"]);
    expect(workBoardQueryKeys.board()).toEqual(["work-board", "board"]);
  });
});
