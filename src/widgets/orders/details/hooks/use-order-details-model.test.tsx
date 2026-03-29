import { renderHook } from "@testing-library/react";

import { ApiError } from "@/shared/api/api-error";
import { useMechanicsRegistryQuery } from "@/entities/mechanic/api/queries";
import { useOrderActivityQuery, useOrderDetailsQuery } from "@/entities/order/api/queries";
import { useOrderDetailsOverviewModel } from "./use-order-details-model";

vi.mock("@/entities/order/api/queries", () => ({
  useOrderDetailsQuery: vi.fn(),
  useOrderActivityQuery: vi.fn(),
}));
vi.mock("@/entities/mechanic/api/queries", () => ({
  useMechanicsRegistryQuery: vi.fn(),
}));

const mockedUseOrderDetailsQuery = vi.mocked(useOrderDetailsQuery);
const mockedUseOrderActivityQuery = vi.mocked(useOrderActivityQuery);
const mockedUseMechanicsRegistryQuery = vi.mocked(useMechanicsRegistryQuery);

function buildQueryState(overrides: Record<string, unknown> = {}) {
  return {
    data: undefined,
    error: null,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
  };
}

describe("useOrderDetailsOverviewModel", () => {
  beforeEach(() => {
    mockedUseOrderDetailsQuery.mockReset();
    mockedUseOrderActivityQuery.mockReset();
    mockedUseMechanicsRegistryQuery.mockReset();
    mockedUseMechanicsRegistryQuery.mockReturnValue(
      buildQueryState({
        data: {
          items: [{ name: "Ivan Petrov" }, { name: "Nikolai Volkov" }],
        },
      }) as never,
    );
  });

  it("treats 404 on details as not found", () => {
    mockedUseOrderDetailsQuery.mockReturnValue(
      buildQueryState({
        isError: true,
        error: new ApiError(404, "Order not found"),
      }) as never,
    );
    mockedUseOrderActivityQuery.mockReturnValue(buildQueryState() as never);

    const { result } = renderHook(() => useOrderDetailsOverviewModel("ord_001"));

    expect(result.current.isNotFound).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.mechanics).toEqual(["Ivan Petrov", "Nikolai Volkov"]);
  });

  it("does not treat activity 404 as not found", () => {
    mockedUseOrderDetailsQuery.mockReturnValue(
      buildQueryState({
        data: { id: "ord_001" },
      }) as never,
    );
    mockedUseOrderActivityQuery.mockReturnValue(
      buildQueryState({
        isError: true,
        error: new ApiError(404, "Activity not found"),
      }) as never,
    );

    const { result } = renderHook(() => useOrderDetailsOverviewModel("ord_001"));

    expect(result.current.isNotFound).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isActivityError).toBe(true);
  });

  it("reports page error for non-404 details failures", () => {
    mockedUseOrderDetailsQuery.mockReturnValue(
      buildQueryState({
        isError: true,
        error: new ApiError(500, "Request failed"),
      }) as never,
    );
    mockedUseOrderActivityQuery.mockReturnValue(buildQueryState() as never);

    const { result } = renderHook(() => useOrderDetailsOverviewModel("ord_001"));

    expect(result.current.isError).toBe(true);
    expect(result.current.isNotFound).toBe(false);
  });

  it("retries all queries and activity-only query", () => {
    const detailsRefetch = vi.fn();
    const activityRefetch = vi.fn();

    mockedUseOrderDetailsQuery.mockReturnValue(
      buildQueryState({
        refetch: detailsRefetch,
      }) as never,
    );
    mockedUseOrderActivityQuery.mockReturnValue(
      buildQueryState({
        refetch: activityRefetch,
      }) as never,
    );

    const { result } = renderHook(() => useOrderDetailsOverviewModel("ord_001"));

    result.current.refetchAll();
    expect(detailsRefetch).toHaveBeenCalledTimes(1);
    expect(activityRefetch).toHaveBeenCalledTimes(1);

    result.current.refetchActivity();
    expect(activityRefetch).toHaveBeenCalledTimes(2);
  });
});
