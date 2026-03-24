import { analyticsHandlers } from "@/mocks/handlers/analytics";
import { customersHandlers } from "@/mocks/handlers/customers";
import { dashboardHandlers } from "@/mocks/handlers/dashboard";
import { mechanicsHandlers } from "@/mocks/handlers/mechanics";
import { ordersHandlers } from "@/mocks/handlers/orders";
import { vehiclesHandlers } from "@/mocks/handlers/vehicles";
import { workBoardHandlers } from "@/mocks/handlers/work-board";

<<<<<<< HEAD
export const handlers = [...dashboardHandlers, ...ordersHandlers, ...workBoardHandlers, ...customersHandlers, ...vehiclesHandlers];
=======
export const handlers = [
  ...dashboardHandlers,
  ...ordersHandlers,
  ...workBoardHandlers,
  ...customersHandlers,
  ...vehiclesHandlers,
  ...mechanicsHandlers,
  ...analyticsHandlers,
];
>>>>>>> bca1a401e8d56c19ed2e8f50eeaddd774815ee36
