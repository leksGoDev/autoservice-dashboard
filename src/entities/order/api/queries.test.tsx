import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";

import { useOrderActivityQuery, useOrderDetailsQuery, useOrdersListQuery } from "./queries";

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

describe("useOrdersListQuery", () => {
  it("loads list data", async () => {
    const { result } = renderHook(() => useOrdersListQuery({ page: 1, pageSize: 5 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items.length).toBe(5);
    expect(result.current.data?.page).toBe(1);
  });

  it("applies server-side status filter", async () => {
    const { result } = renderHook(
      () => useOrdersListQuery({ status: "waiting_parts", page: 1, pageSize: 20 }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const statuses = result.current.data?.items.map((item) => item.status) ?? [];
    expect(statuses.every((status) => status === "waiting_parts")).toBe(true);
  });

  it("returns api-provided presentation fields", async () => {
    const { result } = renderHook(() => useOrdersListQuery({ page: 1, pageSize: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items[0]).toEqual(
      expect.objectContaining({
        priority: expect.any(String),
        assignedMechanic: expect.any(String),
        jobsCount: expect.any(Number),
      }),
    );
  });

  it("loads order details", async () => {
    const { result } = renderHook(() => useOrderDetailsQuery("ord_001"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id).toBe("ord_001");
    expect(result.current.data?.jobs.length).toBeGreaterThan(0);
    expect(result.current.data?.parts.length).toBeGreaterThan(0);
  });

  it("loads order activity", async () => {
    const { result } = renderHook(() => useOrderActivityQuery("ord_001"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.length).toBeGreaterThan(0);
    expect(result.current.data?.[0]).toEqual(
      expect.objectContaining({
        type: expect.any(String),
        timestamp: expect.any(String),
      }),
    );
  });
});
