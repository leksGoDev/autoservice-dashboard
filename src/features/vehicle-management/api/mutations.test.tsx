import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";

import { useCreateVehicleMutation } from "./mutations";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("vehicle management mutations", () => {
  it("creates vehicle linked to selected customer", async () => {
    const customerBeforeResponse = await fetch("/api/customers/cust_001");
    const customerBefore = await customerBeforeResponse.json();

    const { result } = renderHook(() => useCreateVehicleMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        customerId: "cust_001",
        vin: "1HGCM82633A123099",
        plateNumber: "TX-9001",
        make: "Honda",
        model: "Civic",
        year: 2023,
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const vehicleResponse = await fetch("/api/vehicles?search=TX-9001&page=1&pageSize=20");
    const vehicleList = await vehicleResponse.json();
    const customerAfterResponse = await fetch("/api/customers/cust_001");
    const customerAfter = await customerAfterResponse.json();

    expect(vehicleList.items).toHaveLength(1);
    expect(vehicleList.items[0].customerId).toBe("cust_001");
    expect(vehicleList.items[0].owner).toBe("Aleksey Volkov");
    expect(customerAfter.vehicles.length).toBe(customerBefore.vehicles.length + 1);
  });
});
