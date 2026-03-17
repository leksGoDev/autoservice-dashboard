import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";

import { useOrdersListQuery } from "./queries";

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
});
