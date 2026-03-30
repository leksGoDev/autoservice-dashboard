import { act, renderHook, waitFor } from "@testing-library/react";

import { ApiError } from "@/shared/api/api-error";
import {
  useAssignOrderMechanicMutation,
  useSetOrderFlagMutation,
  useUpdateOrderStatusMutation,
} from "@/features/order-operations/api/mutations";
import { useI18n } from "@/shared/i18n/use-i18n";
import { useOrderControlsModel } from "./use-order-controls-model";

vi.mock("@/features/order-operations/api/mutations", () => ({
  useUpdateOrderStatusMutation: vi.fn(),
  useAssignOrderMechanicMutation: vi.fn(),
  useSetOrderFlagMutation: vi.fn(),
}));

vi.mock("@/shared/i18n/use-i18n", () => ({
  useI18n: vi.fn(),
}));

const mockedUseUpdateOrderStatusMutation = vi.mocked(useUpdateOrderStatusMutation);
const mockedUseAssignOrderMechanicMutation = vi.mocked(useAssignOrderMechanicMutation);
const mockedUseSetOrderFlagMutation = vi.mocked(useSetOrderFlagMutation);
const mockedUseI18n = vi.mocked(useI18n);

type MutationMock = {
  mutateAsync: ReturnType<typeof vi.fn>;
  reset: ReturnType<typeof vi.fn>;
  isPending: boolean;
  error: unknown;
};

function createMutationMock(overrides: Partial<MutationMock> = {}): MutationMock {
  return {
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    reset: vi.fn(),
    isPending: false,
    error: null,
    ...overrides,
  };
}

describe("useOrderControlsModel", () => {
  beforeEach(() => {
    mockedUseI18n.mockReturnValue({
      t: (key: string) => key,
    } as never);
  });

  it("builds sorted mechanics list, removes empty values, and includes assigned mechanic", () => {
    const updateMutation = createMutationMock();
    const assignMutation = createMutationMock();
    const flagMutation = createMutationMock();

    mockedUseUpdateOrderStatusMutation.mockReturnValue(updateMutation as never);
    mockedUseAssignOrderMechanicMutation.mockReturnValue(assignMutation as never);
    mockedUseSetOrderFlagMutation.mockReturnValue(flagMutation as never);

    const { result } = renderHook(() =>
      useOrderControlsModel({
        orderId: "ord_001",
        status: "in_progress",
        assignedMechanic: "Zoe",
        flagged: false,
        mechanics: ["", "Ivan", "Zoe", "Alex", "Alex", "  "],
      }),
    );

    expect(result.current.availableMechanics).toEqual(["Alex", "Ivan", "Zoe"]);
  });

  it("tracks dirty flags and synchronizes local controls with incoming props", () => {
    const updateMutation = createMutationMock();
    const assignMutation = createMutationMock();
    const flagMutation = createMutationMock();

    mockedUseUpdateOrderStatusMutation.mockReturnValue(updateMutation as never);
    mockedUseAssignOrderMechanicMutation.mockReturnValue(assignMutation as never);
    mockedUseSetOrderFlagMutation.mockReturnValue(flagMutation as never);

    const { result, rerender } = renderHook(
      (props: { status: "scheduled" | "in_progress"; assignedMechanic: string }) =>
        useOrderControlsModel({
          orderId: "ord_001",
          status: props.status,
          assignedMechanic: props.assignedMechanic,
          flagged: false,
          mechanics: ["Alex", "Ivan"],
        }),
      {
        initialProps: {
          status: "scheduled",
          assignedMechanic: "Alex",
        },
      },
    );

    expect(result.current.isStatusDirty).toBe(false);
    expect(result.current.isMechanicDirty).toBe(false);

    act(() => {
      result.current.setNextStatus("in_progress");
      result.current.setNextMechanic("Ivan");
    });

    expect(result.current.isStatusDirty).toBe(true);
    expect(result.current.isMechanicDirty).toBe(true);

    rerender({
      status: "in_progress",
      assignedMechanic: "Ivan",
    });

    expect(result.current.nextStatus).toBe("in_progress");
    expect(result.current.nextMechanic).toBe("Ivan");
    expect(result.current.isStatusDirty).toBe(false);
    expect(result.current.isMechanicDirty).toBe(false);
  });

  it("toggles flag value through mutation and reports success key message", async () => {
    const updateMutation = createMutationMock();
    const assignMutation = createMutationMock();
    const flagMutation = createMutationMock();

    mockedUseUpdateOrderStatusMutation.mockReturnValue(updateMutation as never);
    mockedUseAssignOrderMechanicMutation.mockReturnValue(assignMutation as never);
    mockedUseSetOrderFlagMutation.mockReturnValue(flagMutation as never);

    const { result } = renderHook(() =>
      useOrderControlsModel({
        orderId: "ord_001",
        status: "scheduled",
        assignedMechanic: "Alex",
        flagged: false,
        mechanics: ["Alex"],
      }),
    );

    await act(async () => {
      await result.current.handleFlagToggle();
    });

    expect(flagMutation.mutateAsync).toHaveBeenCalledWith({
      orderId: "ord_001",
      flagged: true,
    });
    expect(result.current.successMessage).toBe("pages.orders.operations.success.flagged");
    expect(updateMutation.reset).toHaveBeenCalledTimes(1);
    expect(assignMutation.reset).toHaveBeenCalledTimes(1);
    expect(flagMutation.reset).toHaveBeenCalledTimes(1);
  });

  it("shows ApiError message when any mutation fails", () => {
    const updateMutation = createMutationMock();
    const assignMutation = createMutationMock({
      error: new ApiError(409, "Mechanic is unavailable"),
    });
    const flagMutation = createMutationMock();

    mockedUseUpdateOrderStatusMutation.mockReturnValue(updateMutation as never);
    mockedUseAssignOrderMechanicMutation.mockReturnValue(assignMutation as never);
    mockedUseSetOrderFlagMutation.mockReturnValue(flagMutation as never);

    const { result } = renderHook(() =>
      useOrderControlsModel({
        orderId: "ord_001",
        status: "scheduled",
        assignedMechanic: "Alex",
        flagged: false,
        mechanics: ["Alex"],
      }),
    );

    expect(result.current.errorMessage).toBe("Mechanic is unavailable");
  });

  it("falls back to translated message for unknown mutation errors", async () => {
    const updateMutation = createMutationMock({
      mutateAsync: vi.fn().mockRejectedValue({}),
      error: {},
    });
    const assignMutation = createMutationMock();
    const flagMutation = createMutationMock();

    mockedUseUpdateOrderStatusMutation.mockReturnValue(updateMutation as never);
    mockedUseAssignOrderMechanicMutation.mockReturnValue(assignMutation as never);
    mockedUseSetOrderFlagMutation.mockReturnValue(flagMutation as never);

    const { result } = renderHook(() =>
      useOrderControlsModel({
        orderId: "ord_001",
        status: "scheduled",
        assignedMechanic: "Alex",
        flagged: false,
        mechanics: ["Alex"],
      }),
    );

    await act(async () => {
      await result.current.handleStatusUpdate();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe("pages.orders.operations.errorFallback");
    });
  });
});
