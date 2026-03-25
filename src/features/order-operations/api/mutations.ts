import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  assignOrderMechanic,
  setOrderFlag,
  updateOrderStatus,
} from "@/entities/order/api/requests";
import type {
  OrderStatus,
  SetOrderFlagPayload,
  UpdateOrderStatusPayload,
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
