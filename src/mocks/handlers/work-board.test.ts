async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

describe("workBoardHandlers", () => {
  it("returns kanban columns grouped by status", async () => {
    const data = await getJson("/api/work-board");

    expect(data.columns).toHaveLength(4);
    expect(data.columns.map((column: { status: string }) => column.status)).toEqual([
      "scheduled",
      "in_progress",
      "waiting_parts",
      "completed",
    ]);

    expect(data.columns.every((column: { cards: unknown[] }) => Array.isArray(column.cards))).toBe(true);
    expect(data.totalCards).toBeGreaterThan(0);
  });

  it("returns cards with quick actions and operational context", async () => {
    const data = await getJson("/api/work-board");
    const firstCard = data.columns.flatMap((column: { cards: unknown[] }) => column.cards)[0] as {
      orderNumber: string;
      shortContext: string;
      availableActions: string[];
      assignedMechanic: string;
    };

    expect(firstCard.orderNumber).toMatch(/^ORD-/);
    expect(firstCard.shortContext).toContain("Updated");
    expect(firstCard.assignedMechanic.length).toBeGreaterThan(0);
    expect(firstCard.availableActions.length).toBeGreaterThan(0);
  });
});
