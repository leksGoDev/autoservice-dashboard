import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";

import { useCustomerDetailsQuery, useCustomersListQuery } from "./queries";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useCustomersListQuery", () => {
  it("loads list data", async () => {
    const { result } = renderHook(() => useCustomersListQuery({ page: 1, pageSize: 4 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items.length).toBe(4);
    expect(result.current.data?.page).toBe(1);
  });

  it("applies server-side search", async () => {
    const { result } = renderHook(() => useCustomersListQuery({ search: "alex", page: 1, pageSize: 20 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const names = result.current.data?.items.map((item) => item.fullName.toLowerCase()) ?? [];
    expect(names.every((name) => name.includes("alex"))).toBe(true);
  });

  it("loads customer details", async () => {
    const { result } = renderHook(() => useCustomerDetailsQuery("cust_001"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.customer.id).toBe("cust_001");
    expect(result.current.data?.vehicles.length).toBeGreaterThan(0);
    expect(result.current.data?.orders.length).toBeGreaterThan(0);
  });

  it("does not run details query without customer id", async () => {
    const { result } = renderHook(() => useCustomerDetailsQuery(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.status).toBe("pending");
  });
});
