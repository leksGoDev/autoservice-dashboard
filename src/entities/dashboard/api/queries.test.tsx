import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";

import { useDashboardOverviewQuery } from "./queries";

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

describe("useDashboardOverviewQuery", () => {
  it("loads overview payload for selected range", async () => {
    const { result } = renderHook(() => useDashboardOverviewQuery("7d"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(
      expect.objectContaining({
        metrics: expect.any(Object),
        revenue: expect.any(Array),
        ordersTrend: expect.any(Array),
        mechanicWorkload: expect.any(Array),
        recentActivity: expect.any(Array),
        recentOrders: expect.any(Array),
      }),
    );
    expect(result.current.data?.revenue).toHaveLength(7);
  });
});
