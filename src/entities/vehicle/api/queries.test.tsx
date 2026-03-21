import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";

import { useVehicleDetailsQuery, useVehicleServiceHistoryQuery, useVehiclesListQuery } from "./queries";

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

describe("useVehiclesListQuery", () => {
  it("loads list data", async () => {
    const { result } = renderHook(() => useVehiclesListQuery({ page: 1, pageSize: 5 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items.length).toBe(5);
    expect(result.current.data?.page).toBe(1);
  });

  it("applies server-side search", async () => {
    const { result } = renderHook(() => useVehiclesListQuery({ search: "tesla", page: 1, pageSize: 20 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const makes = result.current.data?.items.map((item) => item.make.toLowerCase()) ?? [];
    expect(makes.every((make) => make.includes("tesla"))).toBe(true);
  });

  it("loads vehicle details", async () => {
    const { result } = renderHook(() => useVehicleDetailsQuery("veh_001"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id).toBe("veh_001");
  });

  it("loads vehicle service history", async () => {
    const { result } = renderHook(() => useVehicleServiceHistoryQuery("veh_001"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.length).toBeGreaterThan(0);
  });
});
