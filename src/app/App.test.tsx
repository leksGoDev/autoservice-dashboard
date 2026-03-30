import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRegisterSW } from "virtual:pwa-register/react";

import { App } from "./App";

const mockSetNeedRefresh = vi.fn();
const mockSetOfflineReady = vi.fn();
const mockUpdateServiceWorker = vi.fn();

vi.mock("react-router-dom", () => ({
  RouterProvider: () => <div data-testid="router-provider" />,
}));

vi.mock("./router", () => ({
  router: {},
}));

vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: vi.fn(),
}));

const mockUseRegisterSW = vi.mocked(useRegisterSW);

describe("App PWA update flow", () => {
  beforeEach(() => {
    mockSetNeedRefresh.mockReset();
    mockSetOfflineReady.mockReset();
    mockUpdateServiceWorker.mockReset();
    mockUseRegisterSW.mockReset();
    mockUseRegisterSW.mockReturnValue({
      needRefresh: [false, mockSetNeedRefresh],
      offlineReady: [false, mockSetOfflineReady],
      updateServiceWorker: mockUpdateServiceWorker,
    });
  });

  it("does not show update banner when no refresh is required", () => {
    render(<App />);

    expect(mockUseRegisterSW).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Update available")).not.toBeInTheDocument();
    expect(screen.getByTestId("router-provider")).toBeInTheDocument();
  });

  it("shows update banner and dismisses it", () => {
    mockUseRegisterSW.mockReturnValue({
      needRefresh: [true, mockSetNeedRefresh],
      offlineReady: [false, mockSetOfflineReady],
      updateServiceWorker: mockUpdateServiceWorker,
    });
    render(<App />);

    expect(screen.getByText("Update available")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Later" }));
    expect(mockSetNeedRefresh).toHaveBeenCalledWith(false);
  });

  it("reloads app when user confirms update", () => {
    mockUseRegisterSW.mockReturnValue({
      needRefresh: [true, mockSetNeedRefresh],
      offlineReady: [false, mockSetOfflineReady],
      updateServiceWorker: mockUpdateServiceWorker,
    });
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Reload now" }));
    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);
  });
});
