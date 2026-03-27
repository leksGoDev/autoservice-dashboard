import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import { getCustomersList } from "@/entities/customer/api/requests";
import { getMechanicsRegistry } from "@/entities/mechanic/api/requests";
import { getVehiclesList } from "@/entities/vehicle/api/requests";
import { queryKeys } from "@/shared/api/query-keys";

type UseCreateOrderBootstrapQueryInput = {
  shouldLoadVehicles: boolean;
  shouldLoadMechanics: boolean;
};

const CUSTOMERS_PARAMS = { page: 1, pageSize: 100 } as const;
const VEHICLES_PARAMS = { page: 1, pageSize: 200 } as const;
const MECHANICS_PARAMS = { page: 1, pageSize: 100 } as const;

export function useCreateOrderBootstrapQuery(input: UseCreateOrderBootstrapQueryInput) {
  const [customersQuery, vehiclesQuery, mechanicsQuery] = useQueries({
    queries: [
      {
        queryKey: queryKeys.customers.list(CUSTOMERS_PARAMS),
        queryFn: () => getCustomersList(CUSTOMERS_PARAMS),
        staleTime: 60_000,
      },
      {
        queryKey: queryKeys.vehicles.list(VEHICLES_PARAMS),
        queryFn: () => getVehiclesList(VEHICLES_PARAMS),
        enabled: input.shouldLoadVehicles,
        staleTime: 60_000,
      },
      {
        queryKey: queryKeys.mechanics.registry(MECHANICS_PARAMS),
        queryFn: () => getMechanicsRegistry(MECHANICS_PARAMS),
        enabled: input.shouldLoadMechanics,
        staleTime: 60_000,
      },
    ],
  });

  const mechanics = useMemo(
    () => [...new Set((mechanicsQuery.data?.items ?? []).map((item) => item.name))].sort((a, b) => a.localeCompare(b)),
    [mechanicsQuery.data?.items],
  );

  const isLoading = customersQuery.isLoading;
  const hasError = customersQuery.isError;
  const isVehiclesLoading = input.shouldLoadVehicles && vehiclesQuery.isLoading;
  const isMechanicsLoading = input.shouldLoadMechanics && mechanicsQuery.isLoading;
  const hasVehiclesError = input.shouldLoadVehicles && vehiclesQuery.isError;
  const hasMechanicsError = input.shouldLoadMechanics && mechanicsQuery.isError;

  return {
    customers: customersQuery.data?.items ?? [],
    vehicles: vehiclesQuery.data?.items ?? [],
    mechanics,
    isLoading,
    hasError,
    isVehiclesLoading,
    isMechanicsLoading,
    hasVehiclesError,
    hasMechanicsError,
    refetch: () => {
      customersQuery.refetch();

      if (input.shouldLoadVehicles) {
        vehiclesQuery.refetch();
      }

      if (input.shouldLoadMechanics) {
        mechanicsQuery.refetch();
      }
    },
  };
}
