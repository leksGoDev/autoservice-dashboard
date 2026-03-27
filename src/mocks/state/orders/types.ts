import type { OrderActivityItem, OrderListItem, OrderPartItem, OrderServiceJob } from "@/entities/order/model/types";

export type MockOrderStateItem = OrderListItem & {
  scheduledFor?: string | null;
  complaint?: string;
  notes?: string;
  jobs: OrderServiceJob[];
  parts: OrderPartItem[];
  activity: OrderActivityItem[];
  nextJobSequence: number;
  nextPartSequence: number;
  nextActivitySequence: number;
};
