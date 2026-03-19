import type { RecentOrderItem } from "./types";
import {
  formatDashboardDate,
  formatRelativeTime,
  getActivityTone,
  getOrderPriorityKey,
  getOrderStatusKey,
  getStatusChipModifier,
  getWorkloadTone,
} from "./presentation";

describe("dashboard presentation helpers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats relative minutes and hours", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-20T12:00:00.000Z"));

    expect(formatRelativeTime("2026-03-20T11:55:00.000Z", "en")).toBe("5 minutes ago");
    expect(formatRelativeTime("2026-03-20T09:00:00.000Z", "en")).toBe("3 hours ago");
  });

  it("falls back to calendar date for old timestamps", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-20T12:00:00.000Z"));

    const dateIso = "2026-03-18T09:00:00.000Z";

    expect(formatRelativeTime(dateIso, "en")).toBe(formatDashboardDate(dateIso, "en"));
  });

  it("maps activity types to expected tones", () => {
    expect(getActivityTone("order_created")).toBe("neutral");
    expect(getActivityTone("status_changed")).toBe("success");
    expect(getActivityTone("parts_updated")).toBe("warning");
  });

  it("returns status and priority translation keys", () => {
    expect(getOrderStatusKey("waiting_parts")).toBe("order.status.waiting_parts");
    expect(getOrderPriorityKey("high")).toBe("order.priority.high");
  });

  it("formats chip modifier and workload thresholds", () => {
    const status: RecentOrderItem["status"] = "in_progress";

    expect(getStatusChipModifier(status)).toBe("in-progress");
    expect(getWorkloadTone(74)).toBe("normal");
    expect(getWorkloadTone(75)).toBe("warning");
    expect(getWorkloadTone(90)).toBe("danger");
  });
});
