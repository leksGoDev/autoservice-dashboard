import "@testing-library/jest-dom/vitest";

import { afterAll, afterEach, beforeAll } from "vitest";

import { resetOrdersMockState } from "@/mocks/state/orders";
import { server } from "./test-server";

if (typeof window !== "undefined") {
  window.localStorage.setItem("autoservice.locale", "en");
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
  resetOrdersMockState();
});

afterAll(() => {
  server.close();
});
