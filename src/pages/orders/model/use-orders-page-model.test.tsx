import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";

import { useOrdersPageModel } from "./use-orders-page-model";

function createWrapper(initialEntry: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

describe("useOrdersPageModel", () => {
  it("falls back to first page for invalid page param", async () => {
    const { result } = renderHook(() => useOrdersPageModel(), {
      wrapper: createWrapper("/orders?page=-4"),
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    expect(result.current.page).toBe(1);
  });

  it("clamps page to totalPages", async () => {
    const { result } = renderHook(() => useOrdersPageModel(), {
      wrapper: createWrapper("/orders?page=99&status=cancelled"),
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    expect(result.current.totalPages).toBe(1);
    expect(result.current.page).toBe(1);
  });

  it("resets page to 1 when toolbar filters change", async () => {
    const { result } = renderHook(() => useOrdersPageModel(), {
      wrapper: createWrapper("/orders?page=2"),
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    act(() => {
      result.current.onToolbarChange({
        search: "ORD-1001",
        status: "in_progress",
      });
    });

    await waitFor(() => {
      expect(result.current.filters.search).toBe("ORD-1001");
    });

    expect(result.current.filters.status).toBe("in_progress");
    expect(result.current.page).toBe(1);
  });

  it("keeps existing filters when changing page", async () => {
    const { result } = renderHook(() => useOrdersPageModel(), {
      wrapper: createWrapper("/orders?page=1&search=ord"),
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    act(() => {
      result.current.onPageChange(2);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });

    expect(result.current.filters.search).toBe("ord");
  });

  it("clears all filters on reset", async () => {
    const { result } = renderHook(() => useOrdersPageModel(), {
      wrapper: createWrapper("/orders?page=2&search=ord&status=scheduled&priority=high"),
    });

    await waitFor(() => {
      expect(result.current.listQuery.isSuccess).toBe(true);
    });

    act(() => {
      result.current.onResetFilters();
    });

    await waitFor(() => {
      expect(result.current.filters.search).toBe("");
    });

    expect(result.current.filters.status).toBe("");
    expect(result.current.filters.priority).toBe("");
    expect(result.current.page).toBe(1);
  });
});
