import "@testing-library/jest-dom/vitest";

import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { resetCustomersMockState } from "@/mocks/state/customers";
import { resetAppointmentsMockState } from "@/mocks/state/appointments";
import { resetOrdersMockState } from "@/mocks/state/orders";
import { resetVehiclesMockState } from "@/mocks/state/vehicles";
import { server } from "./test-server";

vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts");

  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children?: unknown }) => children,
  };
});

if (typeof window !== "undefined") {
  window.localStorage.setItem("autoservice.locale", "en");
}

if (typeof window !== "undefined") {
  class ResizeObserverMock implements ResizeObserver {
    public observe() {
      return undefined;
    }

    public unobserve() {
      return undefined;
    }

    public disconnect() {
      return undefined;
    }
  }

  Object.defineProperty(window, "ResizeObserver", {
    configurable: true,
    writable: true,
    value: ResizeObserverMock,
  });

  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      return 1024;
    },
  });

  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get() {
      return 768;
    },
  });

  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get() {
      return 1024;
    },
  });

  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get() {
      return 768;
    },
  });
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
  resetAppointmentsMockState();
  resetOrdersMockState();
  resetCustomersMockState();
  resetVehiclesMockState();
});

afterAll(() => {
  server.close();
});
