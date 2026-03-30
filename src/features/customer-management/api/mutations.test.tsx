import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";

import { useCreateCustomerMutation, useUpdateCustomerMutation } from "./mutations";

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

describe("customer management mutations", () => {
  it("creates customer", async () => {
    const beforeResponse = await fetch("/api/customers?page=1&pageSize=50");
    const before = await beforeResponse.json();

    const { result } = renderHook(() => useCreateCustomerMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        fullName: "Egor Stepanov",
        phone: "+7 (999) 555-01-99",
        email: "egor.stepanov@example.by",
        loyaltyTier: "silver",
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const afterResponse = await fetch("/api/customers?page=1&pageSize=50");
    const after = await afterResponse.json();

    expect(after.total).toBe(before.total + 1);
    expect(after.items.some((item: { fullName: string }) => item.fullName === "Egor Stepanov")).toBe(true);
  });

  it("updates customer and refreshes related vehicle owner", async () => {
    const { result } = renderHook(() => useUpdateCustomerMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        customerId: "cust_001",
        payload: {
          fullName: "Aleksey Volkov Updated",
          phone: "+7 (901) 555-01-09",
          email: "aleksey.volkov.updated@example.ru",
          loyaltyTier: "gold",
        },
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const customerResponse = await fetch("/api/customers/cust_001");
    const customerDetails = await customerResponse.json();
    const vehicleResponse = await fetch("/api/vehicles/veh_001");
    const vehicle = await vehicleResponse.json();

    expect(customerDetails.customer.fullName).toBe("Aleksey Volkov Updated");
    expect(customerDetails.customer.phone).toBe("+7 (901) 555-01-09");
    expect(vehicle.owner).toBe("Aleksey Volkov Updated");
  });
});
