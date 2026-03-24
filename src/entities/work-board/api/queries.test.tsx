import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type PropsWithChildren } from "react";

import { useWorkBoardQuery } from "./queries";

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

describe("useWorkBoardQuery", () => {
  it("loads board columns and cards", async () => {
    const { result } = renderHook(() => useWorkBoardQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.columns.length).toBeGreaterThan(0);
    expect(result.current.data?.totalCards).toBeGreaterThan(0);
    expect(result.current.data?.columns.some((column) => column.cards.length > 0)).toBe(true);
  });
});
