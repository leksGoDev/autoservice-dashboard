import { act, renderHook } from "@testing-library/react";
import { useSearchParams } from "react-router-dom";

import { useAppointmentsListQuery } from "@/entities/appointment/api/queries";
import { useMechanicsRegistryQuery } from "@/entities/mechanic/api/queries";
import { useAppointmentsSchedulingModel } from "./use-appointments-scheduling-model";

vi.mock("react-router-dom", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("@/entities/appointment/api/queries", () => ({
  useAppointmentsListQuery: vi.fn(),
}));

vi.mock("@/entities/mechanic/api/queries", () => ({
  useMechanicsRegistryQuery: vi.fn(),
}));

const mockedUseSearchParams = vi.mocked(useSearchParams);
const mockedUseAppointmentsListQuery = vi.mocked(useAppointmentsListQuery);
const mockedUseMechanicsRegistryQuery = vi.mocked(useMechanicsRegistryQuery);

function buildQueryState(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  };
}

describe("useAppointmentsSchedulingModel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-30T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("groups rows into today, upcoming, overdue and keeps cancelled in upcoming", () => {
    const setSearchParams = vi.fn();
    mockedUseSearchParams.mockReturnValue([new URLSearchParams("page=1"), setSearchParams]);

    mockedUseAppointmentsListQuery.mockReturnValue(
      buildQueryState({
        data: {
          items: [
            {
              id: "apt_today",
              status: "pending",
              scheduledFor: "2026-03-30T15:00:00.000Z",
            },
            {
              id: "apt_overdue",
              status: "confirmed",
              scheduledFor: "2026-03-29T10:00:00.000Z",
            },
            {
              id: "apt_upcoming",
              status: "confirmed",
              scheduledFor: "2026-03-31T10:00:00.000Z",
            },
            {
              id: "apt_cancelled",
              status: "cancelled",
              scheduledFor: "2026-03-29T08:00:00.000Z",
            },
          ],
          total: 4,
          page: 1,
          pageSize: 20,
          totalPages: 1,
        },
      }) as never,
    );

    mockedUseMechanicsRegistryQuery.mockReturnValue(
      buildQueryState({
        data: {
          items: [{ name: "Nikolai Volkov" }, { name: "Alex Kim" }, { name: "Alex Kim" }],
        },
      }) as never,
    );

    const { result } = renderHook(() => useAppointmentsSchedulingModel());

    expect(result.current.groups.find((group) => group.key === "today")?.items.map((item) => item.id)).toEqual([
      "apt_today",
    ]);
    expect(result.current.groups.find((group) => group.key === "overdue")?.items.map((item) => item.id)).toEqual([
      "apt_overdue",
    ]);
    expect(result.current.groups.find((group) => group.key === "upcoming")?.items.map((item) => item.id)).toEqual([
      "apt_upcoming",
      "apt_cancelled",
    ]);
    expect(result.current.mechanics).toEqual(["Alex Kim", "Nikolai Volkov"]);
  });

  it("updates search params via toolbar, page change and reset", () => {
    const setSearchParams = vi.fn();
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams("page=3&search=spark&status=pending&mechanic=Alex"),
      setSearchParams,
    ]);

    mockedUseAppointmentsListQuery.mockReturnValue(
      buildQueryState({
        data: {
          items: [],
          total: 42,
          page: 3,
          pageSize: 20,
          totalPages: 5,
        },
      }) as never,
    );

    mockedUseMechanicsRegistryQuery.mockReturnValue(buildQueryState() as never);

    const { result } = renderHook(() => useAppointmentsSchedulingModel());

    act(() => {
      result.current.onToolbarChange({ status: "confirmed" });
    });

    const toolbarCall = setSearchParams.mock.calls[0][0] as URLSearchParams;
    expect(toolbarCall.get("search")).toBe("spark");
    expect(toolbarCall.get("status")).toBe("confirmed");
    expect(toolbarCall.get("mechanic")).toBe("Alex");
    expect(toolbarCall.get("page")).toBe("1");

    act(() => {
      result.current.onPageChange(4);
    });

    const pageCall = setSearchParams.mock.calls[1][0] as URLSearchParams;
    expect(pageCall.get("search")).toBe("spark");
    expect(pageCall.get("status")).toBe("pending");
    expect(pageCall.get("mechanic")).toBe("Alex");
    expect(pageCall.get("page")).toBe("4");

    act(() => {
      result.current.onResetFilters();
    });

    const resetCall = setSearchParams.mock.calls[2][0] as URLSearchParams;
    expect(resetCall.toString()).toBe("");
  });
});
