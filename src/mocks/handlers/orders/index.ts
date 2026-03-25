import { ordersReadHandlers } from "./read";
import { ordersWriteHandlers } from "./write";

export const ordersHandlers = [...ordersReadHandlers, ...ordersWriteHandlers];
