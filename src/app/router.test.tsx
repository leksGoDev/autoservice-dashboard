import { isValidElement, type ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { appRoutes } from "./router";

describe("appRoutes", () => {
  it("has index redirect from / to /dashboard", () => {
    const root = appRoutes[0];
    const indexRoute = root.children?.find((route) => "index" in route && route.index);

    expect(indexRoute).toBeDefined();
    expect(isValidElement(indexRoute?.element)).toBe(true);

    if (isValidElement(indexRoute?.element)) {
      const element = indexRoute.element as ReactElement<{ to: string; replace?: boolean }>;
      expect(element.type).toBe(Navigate);
      expect(element.props.to).toBe("/dashboard");
      expect(element.props.replace).toBe(true);
    }
  });

  it("registers order details route", () => {
    const root = appRoutes[0];
    const orderDetailsRoute = root.children?.find((route) => "path" in route && route.path === "orders/:orderId");

    expect(orderDetailsRoute).toBeDefined();
  });
});
