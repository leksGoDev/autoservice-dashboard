import { analyticsHandlers } from "@/mocks/handlers/analytics";
import { customersHandlers } from "@/mocks/handlers/customers";
import { dashboardHandlers } from "@/mocks/handlers/dashboard";
import { mechanicsHandlers } from "@/mocks/handlers/mechanics";
import { ordersHandlers } from "@/mocks/handlers/orders";
import { searchHandlers } from "@/mocks/handlers/search";
import { vehiclesHandlers } from "@/mocks/handlers/vehicles";
import { workBoardHandlers } from "@/mocks/handlers/work-board";

export const handlers = [
  ...dashboardHandlers,
  ...ordersHandlers,
  ...searchHandlers,
  ...workBoardHandlers,
  ...customersHandlers,
  ...vehiclesHandlers,
  ...mechanicsHandlers,
  ...analyticsHandlers,
];
