import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCustomer, updateCustomer } from "@/entities/customer/api/requests";
import type { CreateCustomerPayload, UpdateCustomerPayload } from "@/entities/customer/model/types";
import { queryKeys } from "@/shared/api/query-keys";

type UpdateCustomerVariables = {
  customerId: string;
  payload: UpdateCustomerPayload;
};

export function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) => createCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.root });
    },
  });
}

export function useUpdateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, payload }: UpdateCustomerVariables) => updateCustomer(customerId, payload),
    onSuccess: (_customer, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.root });
    },
  });
}
