import { customersHandlers } from "@/mocks/handlers/customers";
import { dashboardHandlers } from "@/mocks/handlers/dashboard";
import { ordersHandlers } from "@/mocks/handlers/orders";
import { vehiclesHandlers } from "@/mocks/handlers/vehicles";

export const handlers = [...dashboardHandlers, ...ordersHandlers, ...customersHandlers, ...vehiclesHandlers];
