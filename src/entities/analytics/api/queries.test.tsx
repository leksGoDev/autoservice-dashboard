import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";

import { useAnalyticsOverviewQuery } from "./queries";

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

describe("useAnalyticsOverviewQuery", () => {
  it("loads analytics overview payload", async () => {
    const { result } = renderHook(() => useAnalyticsOverviewQuery("7d"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(
      expect.objectContaining({
        metrics: expect.any(Object),
        revenue: expect.any(Array),
        ordersPerDay: expect.any(Array),
        jobsByCategory: expect.any(Array),
        mechanicWorkload: expect.any(Array),
      }),
    );
  });
});
