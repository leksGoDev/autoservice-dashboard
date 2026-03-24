import {
  formatCustomerDetailsCurrency,
  formatCustomerDetailsDate,
} from "./formatters";

describe("customer details formatters", () => {
  it("formats valid date with locale", () => {
    const formatted = formatCustomerDetailsDate("2026-03-18T09:10:00.000Z", "en-US", "Unknown");

    expect(formatted).toMatch(/2026/);
  });

  it("returns fallback for empty or invalid dates", () => {
    expect(formatCustomerDetailsDate(null, "en-US", "Unknown")).toBe("Unknown");
    expect(formatCustomerDetailsDate("invalid-date", "en-US", "Unknown")).toBe("Unknown");
  });

  it("formats currency in USD", () => {
    const formatted = formatCustomerDetailsCurrency(1490, "en-US");

    expect(formatted).toBe("$1,490");
  });
});
