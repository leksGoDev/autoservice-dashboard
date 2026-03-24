import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";

import { useMechanicsRegistryQuery } from "./queries";

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

describe("useMechanicsRegistryQuery", () => {
  it("loads mechanics list with search params", async () => {
    const { result } = renderHook(() => useMechanicsRegistryQuery({ page: 1, pageSize: 10, search: "engine" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(
      expect.objectContaining({
        items: expect.any(Array),
        page: 1,
        pageSize: 10,
      }),
    );
  });
});
