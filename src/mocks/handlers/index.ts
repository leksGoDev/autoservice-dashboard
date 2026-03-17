import { dashboardHandlers } from "@/mocks/handlers/dashboard";
import { ordersHandlers } from "@/mocks/handlers/orders";

export const handlers = [...dashboardHandlers, ...ordersHandlers];
