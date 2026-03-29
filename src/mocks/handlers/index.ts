import { appointmentsHandlers } from "@/mocks/handlers/appointments";
import { analyticsHandlers } from "@/mocks/handlers/analytics";
import { customersHandlers } from "@/mocks/handlers/customers";
import { dashboardHandlers } from "@/mocks/handlers/dashboard";
import { mechanicsHandlers } from "@/mocks/handlers/mechanics";
import { ordersHandlers } from "@/mocks/handlers/orders";
import { vehiclesHandlers } from "@/mocks/handlers/vehicles";
import { workBoardHandlers } from "@/mocks/handlers/work-board";

export const handlers = [
  ...dashboardHandlers,
  ...appointmentsHandlers,
  ...ordersHandlers,
  ...workBoardHandlers,
  ...customersHandlers,
  ...vehiclesHandlers,
  ...mechanicsHandlers,
  ...analyticsHandlers,
];
