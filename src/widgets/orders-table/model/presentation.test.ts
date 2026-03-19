import { formatOrderCurrency, formatOrderDate, getOrderStatusChipModifier } from "./presentation";

describe("orders table presentation helpers", () => {
  it("formats status modifier", () => {
    expect(getOrderStatusChipModifier("in_progress")).toBe("in-progress");
    expect(getOrderStatusChipModifier("waiting_parts")).toBe("waiting-parts");
  });

  it("formats currency with dollar prefix", () => {
    expect(formatOrderCurrency(1250)).toBe("$1,250");
  });

  it("formats date using locale date string", () => {
    const dateIso = "2026-03-18T09:35:00.000Z";
    expect(formatOrderDate(dateIso)).toBe(new Date(dateIso).toLocaleDateString());
  });
});
