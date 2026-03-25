import { delay, http, HttpResponse } from "msw";

import type {
  OrderActivityItem,
  OrderDetails,
  OrderListItem,
  OrderPartItem,
  OrderServiceJob,
  OrderStatus,
  ServiceJobStatus,
} from "@/entities/order/model/types";
import { ORDER_STATUSES } from "@/entities/order/model/options";
import { customersFixture } from "@/mocks/fixtures/customers";
import { orderJobCatalogFixture, orderPartCatalogFixture } from "@/mocks/fixtures/orders";
import { vehiclesFixture } from "@/mocks/fixtures/vehicles";
import { paginateItems, parseListQueryParams } from "@/mocks/lib/list";
import {
  assignOrderMechanicState,
  getOrderMockState,
  getOrdersMockState,
  setOrderFlagState,
  type MockOrderStateItem,
  updateOrderStatusState,
} from "@/mocks/state/orders";
import { DEFAULT_ORDERS_SORT_BY, DEFAULT_ORDERS_SORT_DIRECTION } from "@/shared/api/constants";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";

function toOrderListItem(item: MockOrderStateItem): OrderListItem {
  return {
    ...item,
  };
}

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

function getServiceJobStatus(orderStatus: OrderStatus, index: number, jobsCount: number): ServiceJobStatus {
  if (orderStatus === "scheduled") {
    return "pending";
  }

  if (orderStatus === "completed") {
    return "completed";
  }

  if (orderStatus === "cancelled") {
    return index === 0 ? "completed" : "pending";
  }

  if (orderStatus === "waiting_parts") {
    return index === jobsCount - 1 ? "waiting_parts" : "completed";
  }

  return index === jobsCount - 1 ? "in_progress" : "completed";
}

function buildOrderJobs(order: OrderListItem): OrderServiceJob[] {
  return Array.from({ length: order.jobsCount }, (_, index) => {
    const catalogItem =
      orderJobCatalogFixture[(Number(order.id.replace(/\D/g, "")) + index) % orderJobCatalogFixture.length];
    const status = getServiceJobStatus(order.status, index, order.jobsCount);
    const estimatedHours = Number((catalogItem.estimatedHours + index * 0.4).toFixed(1));
    const actualHours =
      status === "pending"
        ? 0
        : status === "in_progress"
          ? Number(Math.max(0.5, estimatedHours - 0.4).toFixed(1))
          : Number((estimatedHours + 0.3).toFixed(1));

    return {
      id: `${order.id}_job_${index + 1}`,
      name: catalogItem.name,
      category: catalogItem.category,
      status,
      assignedMechanic: order.assignedMechanic,
      estimatedHours,
      actualHours,
      laborPrice: Math.round((estimatedHours + (status === "completed" ? 0.2 : 0)) * catalogItem.laborRate),
    };
  });
}

function buildOrderParts(order: OrderListItem, jobs: OrderServiceJob[]): OrderPartItem[] {
  const targetPartsCount = Math.max(1, Math.min(jobs.length + (order.priority === "high" ? 1 : 0), 4));

  return Array.from({ length: targetPartsCount }, (_, index) => {
    const catalogItem =
      orderPartCatalogFixture[(Number(order.id.replace(/\D/g, "")) + index) % orderPartCatalogFixture.length];
    const quantity = (index % 2) + 1;
    const job = jobs[index % jobs.length];

    return {
      id: `${order.id}_part_${index + 1}`,
      jobId: job.id,
      jobName: job.name,
      name: catalogItem.name,
      quantity,
      unitPrice: catalogItem.unitPrice,
      totalPrice: catalogItem.unitPrice * quantity,
    };
  });
}

function buildOrderActivity(order: OrderListItem, jobs: OrderServiceJob[], parts: OrderPartItem[]): OrderActivityItem[] {
  const createdAt = new Date(order.createdAt).getTime();
  const updatedAt = new Date(order.updatedAt).getTime();
  const betweenTimestamps = Math.max(60 * 60 * 1000, updatedAt - createdAt);
  const baseEvents: OrderActivityItem[] = [
    {
      id: `${order.id}_activity_created`,
      type: "order_created",
      timestamp: new Date(createdAt).toISOString(),
      actor: "Service Advisor",
      description: `Work order ${order.number} was created for ${order.vehicleLabel}.`,
    },
    {
      id: `${order.id}_activity_scheduled`,
      type: "order_scheduled",
      timestamp: new Date(createdAt + Math.round(betweenTimestamps * 0.18)).toISOString(),
      actor: "Front Desk",
      description: "Visit window confirmed and the bay slot reserved.",
    },
    {
      id: `${order.id}_activity_assigned`,
      type: "mechanic_assigned",
      timestamp: new Date(createdAt + Math.round(betweenTimestamps * 0.34)).toISOString(),
      actor: "Dispatcher",
      description: `${order.assignedMechanic} was assigned to the order.`,
    },
    {
      id: `${order.id}_activity_job`,
      type: "job_added",
      timestamp: new Date(createdAt + Math.round(betweenTimestamps * 0.48)).toISOString(),
      actor: order.assignedMechanic,
      description: `${jobs[0]?.name ?? "Service job"} was added to the work scope.`,
    },
    {
      id: `${order.id}_activity_part`,
      type: "part_added",
      timestamp: new Date(createdAt + Math.round(betweenTimestamps * 0.65)).toISOString(),
      actor: "Parts Desk",
      description: `${parts[0]?.name ?? "Part"} was added to the order parts list.`,
    },
    {
      id: `${order.id}_activity_status`,
      type: "status_changed",
      timestamp: new Date(createdAt + Math.round(betweenTimestamps * 0.82)).toISOString(),
      actor: order.assignedMechanic,
      description: `Order status updated to ${order.status.replace("_", " ")}.`,
    },
  ];

  if (order.status === "completed") {
    baseEvents.push({
      id: `${order.id}_activity_completed`,
      type: "order_completed",
      timestamp: new Date(updatedAt).toISOString(),
      actor: "Service Advisor",
      description: "Order completed and ready for customer pickup.",
    });
  }

  return baseEvents.sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());
}

function buildOrderDetails(orderState: MockOrderStateItem): OrderDetails {
  const order = toOrderListItem(orderState);
  const customer = customersFixture.find((item) => item.id === order.customerId);
  const vehicle = vehiclesFixture.find((item) => item.id === order.vehicleId);
  const jobs = buildOrderJobs(order);
  const parts = buildOrderParts(order, jobs);

  return {
    ...order,
    customer: {
      id: customer?.id ?? order.customerId,
      fullName: customer?.fullName ?? order.customerName,
      phone: customer?.phone ?? "Unknown",
      email: customer?.email ?? "Unknown",
      loyaltyTier: customer?.loyaltyTier ?? "standard",
    },
    vehicle: {
      id: vehicle?.id ?? order.vehicleId,
      vin: vehicle?.vin ?? "Unknown",
      plateNumber: vehicle?.plateNumber ?? "Unknown",
      make: vehicle?.make ?? "Unknown",
      model: vehicle?.model ?? "Unknown",
      year: vehicle?.year ?? 0,
    },
    jobs,
    parts,
  };
}

function findOrderDetails(orderId: string) {
  const order = getOrderMockState(orderId);
  return order ? buildOrderDetails(order) : undefined;
}

function isValidStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

export const ordersHandlers = [
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
    const order = findOrderDetails(orderId);

    if (!order) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderActivity(order, order.jobs, order.parts));
  }),
  http.patch(toMswPath(apiEndpoints.orders.status(":orderId")), async ({ params, request }) => {
    await delay(250);

    const orderId = String(params.orderId);
    const body = (await request.json().catch(() => null)) as { status?: string } | null;
    const status = body?.status;

    if (!status || !isValidStatus(status)) {
      return HttpResponse.json({ message: "Invalid order status" }, { status: 400 });
    }

    const nextOrder = updateOrderStatusState(orderId, status);

    if (!nextOrder) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder));
  }),
  http.patch(toMswPath(apiEndpoints.orders.detail(":orderId")), async ({ params, request }) => {
    await delay(250);

    const orderId = String(params.orderId);
    const body = (await request.json().catch(() => null)) as { assignedMechanic?: string } | null;
    const assignedMechanic = body?.assignedMechanic?.trim();

    if (!assignedMechanic) {
      return HttpResponse.json({ message: "assignedMechanic is required" }, { status: 400 });
    }

    const nextOrder = assignOrderMechanicState(orderId, assignedMechanic);

    if (!nextOrder) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder));
  }),
  http.patch(toMswPath(apiEndpoints.orders.flag(":orderId")), async ({ params, request }) => {
    await delay(250);

    const orderId = String(params.orderId);
    const body = (await request.json().catch(() => null)) as { flagged?: boolean } | null;

    if (typeof body?.flagged !== "boolean") {
      return HttpResponse.json({ message: "flagged must be boolean" }, { status: 400 });
    }

    const nextOrder = setOrderFlagState(orderId, body.flagged);

    if (!nextOrder) {
      return HttpResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return HttpResponse.json(buildOrderDetails(nextOrder));
  }),
];
