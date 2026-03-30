import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createVehicle } from "@/entities/vehicle/api/requests";
import type { CreateVehiclePayload } from "@/entities/vehicle/model/types";
import { queryKeys } from "@/shared/api/query-keys";

export function useCreateVehicleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVehiclePayload) => createVehicle(payload),
    onSuccess: (vehicle) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(vehicle.customerId) });
    },
  });
}
