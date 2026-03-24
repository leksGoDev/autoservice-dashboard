import { analyticsHandlers } from "@/mocks/handlers/analytics";
import { customersHandlers } from "@/mocks/handlers/customers";
import { dashboardHandlers } from "@/mocks/handlers/dashboard";
import { mechanicsHandlers } from "@/mocks/handlers/mechanics";
import { ordersHandlers } from "@/mocks/handlers/orders";
import { vehiclesHandlers } from "@/mocks/handlers/vehicles";

export const handlers = [
  ...dashboardHandlers,
  ...ordersHandlers,
  ...customersHandlers,
  ...vehiclesHandlers,
  ...mechanicsHandlers,
  ...analyticsHandlers,
];
