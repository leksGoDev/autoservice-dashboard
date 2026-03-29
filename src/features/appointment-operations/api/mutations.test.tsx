import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";

import {
  useCancelAppointmentMutation,
  useConfirmAppointmentMutation,
  useConvertAppointmentToOrderMutation,
  useRescheduleAppointmentMutation,
} from "./mutations";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("appointment mutations", () => {
  it("confirms appointment", async () => {
    const { result } = renderHook(() => useConfirmAppointmentMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ appointmentId: "apt_001" });
    });

    const response = await fetch("/api/appointments/apt_001");
    const body = await response.json();

    expect(body.status).toBe("confirmed");
  });

  it("reschedules appointment", async () => {
    const detailsResponse = await fetch("/api/appointments/apt_004");
    const before = await detailsResponse.json();
    const nextScheduledFor = new Date(new Date(before.scheduledFor).getTime() + 24 * 60 * 60 * 1000).toISOString();

    const { result } = renderHook(() => useRescheduleAppointmentMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        appointmentId: "apt_004",
        scheduledFor: nextScheduledFor,
        assignedMechanic: "Nikolai Volkov",
      });
    });

    const response = await fetch("/api/appointments/apt_004");
    const body = await response.json();

    expect(body.scheduledFor).toBe(nextScheduledFor);
    expect(body.assignedMechanic).toBe("Nikolai Volkov");
  });

  it("cancels appointment", async () => {
    const { result } = renderHook(() => useCancelAppointmentMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ appointmentId: "apt_002" });
    });

    const response = await fetch("/api/appointments/apt_002");
    const body = await response.json();

    expect(body.status).toBe("cancelled");
  });

  it("converts appointment to order", async () => {
    const ordersBeforeResponse = await fetch("/api/orders?page=1&pageSize=100");
    const ordersBefore = await ordersBeforeResponse.json();

    const { result } = renderHook(() => useConvertAppointmentToOrderMutation(), {
      wrapper: createWrapper(),
    });

    let conversion: Awaited<ReturnType<typeof result.current.mutateAsync>>;
    await act(async () => {
      conversion = await result.current.mutateAsync({ appointmentId: "apt_007" });
    });

    await waitFor(async () => {
      const orderResponse = await fetch(`/api/orders/${conversion!.orderId}`);
      expect(orderResponse.status).toBe(200);
    });

    const ordersAfterResponse = await fetch("/api/orders?page=1&pageSize=100");
    const ordersAfter = await ordersAfterResponse.json();

    expect(ordersAfter.total).toBe(ordersBefore.total + 1);
  });
});
