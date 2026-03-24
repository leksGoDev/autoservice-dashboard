export const workBoardQueryKeys = {
  root: ["work-board"] as const,
  board: () => ["work-board", "board"] as const,
} as const;
