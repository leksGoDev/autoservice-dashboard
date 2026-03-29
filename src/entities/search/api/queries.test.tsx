import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";

import { useGlobalSearchQuery } from "./queries";

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

describe("useGlobalSearchQuery", () => {
  it("returns mixed entity results", async () => {
    const { result } = renderHook(() => useGlobalSearchQuery({ query: "alex", limit: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const entityTypes = result.current.data?.items.map((item) => item.entityType) ?? [];

    expect(entityTypes).toContain("customer");
    expect(entityTypes).toContain("order");
    expect(entityTypes).toContain("vehicle");
  });

  it("does not execute when params are undefined", () => {
    const { result } = renderHook(() => useGlobalSearchQuery(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.status).toBe("pending");
  });
});
