import { delay, http, HttpResponse } from "msw";

import { isInsideDateRange } from "@/mocks/lib/date-range";
import { paginateItems, parseListQueryParams } from "@/mocks/lib/list";
import { getOrderMockState, getOrdersMockState } from "@/mocks/state/orders";
import { DEFAULT_ORDERS_SORT_BY, DEFAULT_ORDERS_SORT_DIRECTION } from "@/shared/api/constants";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";
import { buildOrderDetails, toOrderListItem } from "./builders";

function sortOrders(items: ReturnType<typeof toOrderListItem>[], sortBy: string, sortDirection: string) {
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

function findOrderDetails(orderId: string) {
  const order = getOrderMockState(orderId);
  return order ? buildOrderDetails(order) : undefined;
}

export const ordersReadHandlers = [
  http.get(toMswPath(apiEndpoints.orders.list), async ({ request }) => {
    await delay(350);

    const url = new URL(request.url);
    const { page, pageSize, search } = parseListQueryParams(url);
    const status = url.searchParams.get("status");
    const priority = url.searchParams.get("priority");
    const assignedMechanic = url.searchParams.get("assignedMechanic");
    const createdFrom = url.searchParams.get("createdFrom") ?? "";
    const createdTo = url.searchParams.get("createdTo") ?? "";
    const sortBy = url.searchParams.get("sortBy") ?? DEFAULT_ORDERS_SORT_BY;
    const sortDirection = url.searchParams.get("sortDirection") ?? DEFAULT_ORDERS_SORT_DIRECTION;

    let filtered = getOrdersMockState().map(toOrderListItem);

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

    return HttpResponse.json(paginateItems(filtered, page, pageSize));
  }),
  http.get(toMswPath(apiEndpoints.orders.detail(":orderId")), async ({ params }) => {
    await delay(250);

    const orderId = String(params.orderId);
    const order = findOrderDetails(orderId);

    if (!order) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(order);
  }),
  http.get(toMswPath(apiEndpoints.orders.activity(":orderId")), async ({ params }) => {
    await delay(250);

    const orderId = String(params.orderId);
    const order = getOrderMockState(orderId);

    if (!order) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(order.activity);
  }),
];
