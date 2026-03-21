import { delay, http, HttpResponse } from "msw";

import type { OrderListItem, OrderPriority } from "@/entities/order/model/types";
import { ordersFixture, type OrderFixtureItem } from "@/mocks/fixtures/orders";
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

const MECHANICS = ["Ivan Petrov", "Nikolai Volkov", "Sergey Morozov", "Andrey Sokolov"] as const;

function getPriority(totalAmount: number): OrderPriority {
  if (totalAmount >= 900) {
    return "high";
  }
  if (totalAmount >= 500) {
    return "medium";
  }
  return "low";
}

function toOrderListItem(item: OrderFixtureItem): OrderListItem {
  const mechanicIndex = Number(item.id.replace(/\D/g, "")) % MECHANICS.length;

  return {
    ...item,
    priority: getPriority(item.totalAmount),
    assignedMechanic: MECHANICS[mechanicIndex],
    jobsCount: Math.max(1, Math.round(item.totalAmount / 260)),
  };
}

function isInsideDateRange(itemDateIso: string, from: string, to: string) {
  const timestamp = new Date(itemDateIso).getTime();

  if (from) {
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);

    if (timestamp < fromDate.getTime()) {
      return false;
    }
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    if (timestamp > toDate.getTime()) {
      return false;
    }
  }

  return true;
}

export const ordersHandlers = [
  http.get(toMswPath(apiEndpoints.orders.list), async ({ request }) => {
    await delay(350);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? String(DEFAULT_LIST_PAGE));
    const pageSize = Number(url.searchParams.get("pageSize") ?? String(DEFAULT_LIST_PAGE_SIZE));
    const search = (url.searchParams.get("search") ?? "").toLowerCase().trim();
    const status = url.searchParams.get("status");
    const priority = url.searchParams.get("priority");
    const assignedMechanic = url.searchParams.get("assignedMechanic");
    const createdFrom = url.searchParams.get("createdFrom") ?? "";
    const createdTo = url.searchParams.get("createdTo") ?? "";
    const sortBy = url.searchParams.get("sortBy") ?? DEFAULT_ORDERS_SORT_BY;
    const sortDirection = url.searchParams.get("sortDirection") ?? DEFAULT_ORDERS_SORT_DIRECTION;

    let filtered = ordersFixture.map(toOrderListItem);

    if (status) {
      filtered = filtered.filter((order) => order.status === status);
    }

    if (priority) {
      filtered = filtered.filter((order) => order.priority === priority);
    }

    if (assignedMechanic) {
      filtered = filtered.filter((order) => order.assignedMechanic === assignedMechanic);
    }

    if (createdFrom || createdTo) {
      filtered = filtered.filter((order) => isInsideDateRange(order.createdAt, createdFrom, createdTo));
    }

    if (search) {
      filtered = filtered.filter((order) => {
        const haystack =
          `${order.number} ${order.customerName} ${order.vehicleLabel} ${order.assignedMechanic}`.toLowerCase();
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
