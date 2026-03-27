import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createOrder } from "@/entities/order/api/requests";
import { queryKeys } from "@/shared/api/query-keys";
import type { CreateOrderFlowInput } from "../model/types";

export function useCreateOrderFlowMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrderFlowInput) => {
      return createOrder({
        customerId: input.customer.mode === "existing" ? input.customer.customerId : undefined,
        customer:
          input.customer.mode === "new"
            ? {
                fullName: input.customer.fullName,
                phone: input.customer.phone,
                email: input.customer.email,
                loyaltyTier: input.customer.loyaltyTier,
              }
            : undefined,
        vehicleId: input.vehicle.mode === "existing" ? input.vehicle.vehicleId : undefined,
        vehicle:
          input.vehicle.mode === "new"
            ? {
                vin: input.vehicle.vin,
                plateNumber: input.vehicle.plateNumber,
                make: input.vehicle.make,
                model: input.vehicle.model,
                year: input.vehicle.year,
              }
            : undefined,
        scheduledFor: input.scheduledFor,
        complaint: input.complaint,
        notes: input.notes,
        priority: input.priority,
        status: input.status,
        assignedMechanic: input.assignedMechanic,
        initialJobs: input.initialJobs,
      });
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(order.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.workBoard.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.root });
    },
  });
}
