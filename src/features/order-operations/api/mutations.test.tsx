import { renderHook } from "@testing-library/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addPartToJob,
  addServiceJob,
  assignServiceJobMechanic,
  assignOrderMechanic,
  removeJobPart,
  setOrderFlag,
  updateJobPartQuantity,
  updateOrderStatus,
  updateServiceJobStatus,
} from "@/entities/order/api/requests";
import { queryKeys } from "@/shared/api/query-keys";
import {
  useAddJobPartMutation,
  useAddServiceJobMutation,
  useAssignOrderMechanicMutation,
  useAssignServiceJobMechanicMutation,
  useRemoveJobPartMutation,
  useSetOrderFlagMutation,
  useUpdateJobPartQuantityMutation,
  useUpdateOrderStatusMutation,
  useUpdateServiceJobStatusMutation,
} from "./mutations";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("@/entities/order/api/requests", () => ({
  addPartToJob: vi.fn(),
  addServiceJob: vi.fn(),
  assignServiceJobMechanic: vi.fn(),
  assignOrderMechanic: vi.fn(),
  removeJobPart: vi.fn(),
  setOrderFlag: vi.fn(),
  updateJobPartQuantity: vi.fn(),
  updateOrderStatus: vi.fn(),
  updateServiceJobStatus: vi.fn(),
}));

const mockedUseMutation = vi.mocked(useMutation);
const mockedUseQueryClient = vi.mocked(useQueryClient);

const mockedUpdateOrderStatus = vi.mocked(updateOrderStatus);
const mockedAssignOrderMechanic = vi.mocked(assignOrderMechanic);
const mockedSetOrderFlag = vi.mocked(setOrderFlag);
const mockedAddServiceJob = vi.mocked(addServiceJob);
const mockedUpdateServiceJobStatus = vi.mocked(updateServiceJobStatus);
const mockedAssignServiceJobMechanic = vi.mocked(assignServiceJobMechanic);
const mockedAddPartToJob = vi.mocked(addPartToJob);
const mockedUpdateJobPartQuantity = vi.mocked(updateJobPartQuantity);
const mockedRemoveJobPart = vi.mocked(removeJobPart);

type MutationVariables = { orderId: string } & Record<string, unknown>;

type MutationOptions = {
  mutationFn: (variables: MutationVariables) => Promise<unknown>;
  onSuccess?: (data: unknown, variables: MutationVariables) => void;
};

function setupUseMutationMock() {
  mockedUseMutation.mockImplementation((options) => {
    const typedOptions = options as MutationOptions;
    const { mutationFn, onSuccess } = typedOptions;

    return {
      mutateAsync: async (variables: MutationVariables) => {
        const data = await mutationFn(variables);
        onSuccess?.(data, variables);
        return data;
      },
    } as never;
  });
}

function expectCommonInvalidations(
  invalidateQueries: ReturnType<typeof vi.fn>,
  orderId: string,
) {
  expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: queryKeys.orders.root });
  expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: queryKeys.orders.detail(orderId) });
  expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: queryKeys.orders.activity(orderId) });
  expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: queryKeys.workBoard.root });
  expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: queryKeys.dashboard.root });
  expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: queryKeys.appointments.root });
}

describe("order operation mutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupUseMutationMock();
  });

  it("invalidates related query keys after status update", async () => {
    const invalidateQueries = vi.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries } as never);
    mockedUpdateOrderStatus.mockResolvedValue({ id: "ord_001" } as never);

    const { result } = renderHook(() => useUpdateOrderStatusMutation());

    await result.current.mutateAsync({ orderId: "ord_001", status: "completed" });

    expect(mockedUpdateOrderStatus).toHaveBeenCalledWith("ord_001", {
      status: "completed",
    });
    expectCommonInvalidations(invalidateQueries, "ord_001");
  });

  it("invalidates related query keys after order mechanic assignment", async () => {
    const invalidateQueries = vi.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries } as never);
    mockedAssignOrderMechanic.mockResolvedValue({ id: "ord_001" } as never);

    const { result } = renderHook(() => useAssignOrderMechanicMutation());

    await result.current.mutateAsync({
      orderId: "ord_001",
      assignedMechanic: "Chris Nolan",
    });

    expect(mockedAssignOrderMechanic).toHaveBeenCalledWith("ord_001", {
      assignedMechanic: "Chris Nolan",
    });
    expectCommonInvalidations(invalidateQueries, "ord_001");
  });

  it("invalidates related query keys after flag toggle", async () => {
    const invalidateQueries = vi.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries } as never);
    mockedSetOrderFlag.mockResolvedValue({ id: "ord_001" } as never);

    const { result } = renderHook(() => useSetOrderFlagMutation());

    await result.current.mutateAsync({ orderId: "ord_001", flagged: true });

    expect(mockedSetOrderFlag).toHaveBeenCalledWith("ord_001", { flagged: true });
    expectCommonInvalidations(invalidateQueries, "ord_001");
  });

  it("invalidates related query keys after adding service job", async () => {
    const invalidateQueries = vi.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries } as never);
    mockedAddServiceJob.mockResolvedValue({ id: "job_001" } as never);

    const { result } = renderHook(() => useAddServiceJobMutation());

    await result.current.mutateAsync({
      orderId: "ord_001",
      payload: {
        name: "Battery diagnostics",
        category: "Electrical",
        estimatedHours: 1.2,
        laborPrice: 120,
      },
    });

    expect(mockedAddServiceJob).toHaveBeenCalledWith("ord_001", {
      name: "Battery diagnostics",
      category: "Electrical",
      estimatedHours: 1.2,
      laborPrice: 120,
    });
    expectCommonInvalidations(invalidateQueries, "ord_001");
  });

  it("invalidates related query keys after service job status update", async () => {
    const invalidateQueries = vi.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries } as never);
    mockedUpdateServiceJobStatus.mockResolvedValue({ id: "job_001" } as never);

    const { result } = renderHook(() => useUpdateServiceJobStatusMutation());

    await result.current.mutateAsync({
      orderId: "ord_001",
      jobId: "job_001",
      status: "completed",
    });

    expect(mockedUpdateServiceJobStatus).toHaveBeenCalledWith("job_001", {
      status: "completed",
    });
    expectCommonInvalidations(invalidateQueries, "ord_001");
  });

  it("invalidates related query keys after service job mechanic assignment", async () => {
    const invalidateQueries = vi.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries } as never);
    mockedAssignServiceJobMechanic.mockResolvedValue({ id: "job_001" } as never);

    const { result } = renderHook(() => useAssignServiceJobMechanicMutation());

    await result.current.mutateAsync({
      orderId: "ord_001",
      jobId: "job_001",
      assignedMechanic: "Chris Nolan",
    });

    expect(mockedAssignServiceJobMechanic).toHaveBeenCalledWith("job_001", {
      assignedMechanic: "Chris Nolan",
    });
    expectCommonInvalidations(invalidateQueries, "ord_001");
  });

  it("invalidates related query keys after adding job part", async () => {
    const invalidateQueries = vi.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries } as never);
    mockedAddPartToJob.mockResolvedValue({ id: "part_001" } as never);

    const { result } = renderHook(() => useAddJobPartMutation());

    await result.current.mutateAsync({
      orderId: "ord_001",
      jobId: "job_001",
      payload: {
        name: "Brake fluid",
        quantity: 2,
        unitPrice: 35,
      },
    });

    expect(mockedAddPartToJob).toHaveBeenCalledWith("job_001", {
      name: "Brake fluid",
      quantity: 2,
      unitPrice: 35,
    });
    expectCommonInvalidations(invalidateQueries, "ord_001");
  });

  it("invalidates related query keys after updating part quantity", async () => {
    const invalidateQueries = vi.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries } as never);
    mockedUpdateJobPartQuantity.mockResolvedValue({ id: "part_001" } as never);

    const { result } = renderHook(() => useUpdateJobPartQuantityMutation());

    await result.current.mutateAsync({
      orderId: "ord_001",
      jobPartId: "part_001",
      quantity: 4,
    });

    expect(mockedUpdateJobPartQuantity).toHaveBeenCalledWith("part_001", { quantity: 4 });
    expectCommonInvalidations(invalidateQueries, "ord_001");
  });

  it("invalidates related query keys after removing part", async () => {
    const invalidateQueries = vi.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries } as never);
    mockedRemoveJobPart.mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useRemoveJobPartMutation());

    await result.current.mutateAsync({
      orderId: "ord_001",
      jobPartId: "part_001",
    });

    expect(mockedRemoveJobPart).toHaveBeenCalledWith("part_001");
    expectCommonInvalidations(invalidateQueries, "ord_001");
  });
});
