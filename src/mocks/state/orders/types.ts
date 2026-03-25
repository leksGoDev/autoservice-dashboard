import type { OrderActivityItem, OrderListItem, OrderPartItem, OrderServiceJob } from "@/entities/order/model/types";

export type MockOrderStateItem = OrderListItem & {
  jobs: OrderServiceJob[];
  parts: OrderPartItem[];
  activity: OrderActivityItem[];
  nextJobSequence: number;
  nextPartSequence: number;
  nextActivitySequence: number;
};
