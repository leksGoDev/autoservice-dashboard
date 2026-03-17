import { delay, http, HttpResponse } from "msw";

import type { OrderListItem } from "@/entities/order/model/types";
import { ordersFixture } from "@/mocks/fixtures/orders";
import {
  DEFAULT_LIST_PAGE,
  DEFAULT_LIST_PAGE_SIZE,
  DEFAULT_ORDERS_SORT_BY,
  DEFAULT_ORDERS_SORT_DIRECTION,
} from "@/shared/api/constants";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";

function sortOrders(items: OrderListItem[], sortBy: string, sortDirection: string) {
  const direction = sortDirection === "asc" ? 1 : -1;
  const list = [...items];

  list.sort((a, b) => {
    if (sortBy === "totalAmount") {
      return (a.totalAmount - b.totalAmount) * direction;
    }

    const left = sortBy === "updatedAt" ? a.updatedAt : a.createdAt;
    const right = sortBy === "updatedAt" ? b.updatedAt : b.createdAt;
    return (new Date(left).getTime() - new Date(right).getTime()) * direction;
  });

  return list;
}

export const ordersHandlers = [
  http.get(toMswPath(apiEndpoints.orders.list), async ({ request }) => {
    await delay(350);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? String(DEFAULT_LIST_PAGE));
    const pageSize = Number(url.searchParams.get("pageSize") ?? String(DEFAULT_LIST_PAGE_SIZE));
    const search = (url.searchParams.get("search") ?? "").toLowerCase().trim();
    const status = url.searchParams.get("status");
    const sortBy = url.searchParams.get("sortBy") ?? DEFAULT_ORDERS_SORT_BY;
    const sortDirection = url.searchParams.get("sortDirection") ?? DEFAULT_ORDERS_SORT_DIRECTION;

    let filtered = [...ordersFixture];

    if (status) {
      filtered = filtered.filter((order) => order.status === status);
    }

    if (search) {
      filtered = filtered.filter((order) => {
        const haystack = `${order.number} ${order.customerName} ${order.vehicleLabel}`.toLowerCase();
        return haystack.includes(search);
      });
    }

    filtered = sortOrders(filtered, sortBy, sortDirection);

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));
    const start = (safePage - 1) * safePageSize;
    const items = filtered.slice(start, start + safePageSize);

    return HttpResponse.json({
      items,
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages,
    });
  }),
];
