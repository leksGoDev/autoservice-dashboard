import { delay, http, HttpResponse } from "msw";

import type { OrderListItem } from "@/entities/order/model/types";
import { ordersFixture } from "@/mocks/fixtures/orders";

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
  http.get("/api/orders", async ({ request }) => {
    await delay(350);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
    const search = (url.searchParams.get("search") ?? "").toLowerCase().trim();
    const status = url.searchParams.get("status");
    const sortBy = url.searchParams.get("sortBy") ?? "createdAt";
    const sortDirection = url.searchParams.get("sortDirection") ?? "desc";

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
