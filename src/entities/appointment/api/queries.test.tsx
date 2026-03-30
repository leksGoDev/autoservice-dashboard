import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";

import { useAppointmentDetailsQuery, useAppointmentsListQuery } from "./queries";

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

describe("useAppointmentsListQuery", () => {
  it("loads appointments list", async () => {
    const { result } = renderHook(() => useAppointmentsListQuery({ page: 1, pageSize: 5 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items.length).toBe(5);
    expect(result.current.data?.page).toBe(1);
  });

  it("applies status and mechanic filters", async () => {
    const { result } = renderHook(
      () =>
        useAppointmentsListQuery({
          status: "confirmed",
          assignedMechanic: "Artem Bondar",
          page: 1,
          pageSize: 20,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(
      (result.current.data?.items ?? []).every(
        (item) => item.status === "confirmed" && item.assignedMechanic === "Artem Bondar",
      ),
    ).toBe(true);
  });

  it("loads appointment details", async () => {
    const { result } = renderHook(() => useAppointmentDetailsQuery("apt_001"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id).toBe("apt_001");
  });
});
