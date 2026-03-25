import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addPartToJob,
  addServiceJob,
  assignServiceJobMechanic,
  assignOrderMechanic,
  removeJobPart,
  setOrderFlag,
  updateJobPartQuantity,
  updateServiceJobStatus,
  updateOrderStatus,
} from "@/entities/order/api/requests";
import type {
  AddJobPartPayload,
  AddServiceJobPayload,
  AssignServiceJobMechanicPayload,
  OrderStatus,
  ServiceJobStatus,
  SetOrderFlagPayload,
  UpdateJobPartPayload,
  UpdateOrderStatusPayload,
  UpdateServiceJobPayload,
} from "@/entities/order/model/types";
import { queryKeys } from "@/shared/api/query-keys";

type UpdateOrderStatusVariables = {
  orderId: string;
  status: OrderStatus;
};

type AssignOrderMechanicVariables = {
  orderId: string;
  assignedMechanic: string;
};

type SetOrderFlagVariables = {
  orderId: string;
  flagged: boolean;
};

type AddServiceJobVariables = {
  orderId: string;
  payload: AddServiceJobPayload;
};

type UpdateServiceJobStatusVariables = {
  orderId: string;
  jobId: string;
  status: ServiceJobStatus;
};

type AssignServiceJobMechanicVariables = {
  orderId: string;
  jobId: string;
  assignedMechanic: string;
};

type AddJobPartVariables = {
  orderId: string;
  jobId: string;
  payload: AddJobPartPayload;
};

type UpdateJobPartQuantityVariables = {
  orderId: string;
  jobPartId: string;
  quantity: number;
};

type RemoveJobPartVariables = {
  orderId: string;
  jobPartId: string;
};

function invalidateRelatedQueries(queryClient: ReturnType<typeof useQueryClient>, orderId: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.orders.root });
  queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.orders.activity(orderId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.customers.root });
  queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.root });
  queryClient.invalidateQueries({ queryKey: queryKeys.workBoard.root });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: UpdateOrderStatusVariables) =>
      updateOrderStatus(orderId, { status } satisfies UpdateOrderStatusPayload),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.orderId);
    },
  });
}

export function useAssignOrderMechanicMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, assignedMechanic }: AssignOrderMechanicVariables) =>
      assignOrderMechanic(orderId, { assignedMechanic }),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.orderId);
    },
  });
}

export function useSetOrderFlagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, flagged }: SetOrderFlagVariables) =>
      setOrderFlag(orderId, { flagged } satisfies SetOrderFlagPayload),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.orderId);
    },
  });
}

export function useAddServiceJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }: AddServiceJobVariables) => addServiceJob(orderId, payload),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.orderId);
    },
  });
}

export function useUpdateServiceJobStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, status }: UpdateServiceJobStatusVariables) =>
      updateServiceJobStatus(jobId, { status } satisfies UpdateServiceJobPayload),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.orderId);
    },
  });
}

export function useAssignServiceJobMechanicMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, assignedMechanic }: AssignServiceJobMechanicVariables) =>
      assignServiceJobMechanic(jobId, { assignedMechanic } satisfies AssignServiceJobMechanicPayload),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.orderId);
    },
  });
}

export function useAddJobPartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, payload }: AddJobPartVariables) => addPartToJob(jobId, payload),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.orderId);
    },
  });
}

export function useUpdateJobPartQuantityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobPartId, quantity }: UpdateJobPartQuantityVariables) =>
      updateJobPartQuantity(jobPartId, { quantity } satisfies UpdateJobPartPayload),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.orderId);
    },
  });
}

export function useRemoveJobPartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobPartId }: RemoveJobPartVariables) => removeJobPart(jobPartId),
    onSuccess: (_data, variables) => {
      invalidateRelatedQueries(queryClient, variables.orderId);
    },
  });
}
