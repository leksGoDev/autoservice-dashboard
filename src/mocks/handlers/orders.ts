import { delay, http, HttpResponse } from "msw";

import type {
  OrderActivityItem,
  OrderDetails,
  OrderListItem,
  OrderPartItem,
  OrderPriority,
  OrderServiceJob,
  OrderStatus,
  ServiceJobStatus,
} from "@/entities/order/model/types";
import { customersFixture } from "@/mocks/fixtures/customers";
import { ordersFixture, type OrderFixtureItem } from "@/mocks/fixtures/orders";
import { vehiclesFixture } from "@/mocks/fixtures/vehicles";
import {
  DEFAULT_LIST_PAGE,
  DEFAULT_LIST_PAGE_SIZE,
  DEFAULT_ORDERS_SORT_BY,
  DEFAULT_ORDERS_SORT_DIRECTION,
} from "@/shared/api/constants";
import { apiEndpoints, toMswPath } from "@/shared/api/endpoints";

type JobCatalogItem = {
  name: string;
  category: string;
  estimatedHours: number;
  laborRate: number;
};

type PartCatalogItem = {
  name: string;
  unitPrice: number;
};

const MECHANICS = ["Ivan Petrov", "Nikolai Volkov", "Sergey Morozov", "Andrey Sokolov"] as const;

const JOB_CATALOG: JobCatalogItem[] = [
  { name: "Initial inspection", category: "Diagnostics", estimatedHours: 1.2, laborRate: 95 },
  { name: "Brake system service", category: "Repair", estimatedHours: 2.4, laborRate: 120 },
  { name: "Suspension adjustment", category: "Repair", estimatedHours: 2.1, laborRate: 110 },
  { name: "Engine tune-up", category: "Maintenance", estimatedHours: 1.8, laborRate: 105 },
  { name: "Electrical diagnostics", category: "Electrical", estimatedHours: 1.5, laborRate: 115 },
];

const PART_CATALOG: PartCatalogItem[] = [
  { name: "Brake pads set", unitPrice: 140 },
  { name: "Oil filter", unitPrice: 18 },
  { name: "Spark plug", unitPrice: 24 },
  { name: "Cabin air filter", unitPrice: 22 },
  { name: "Wheel speed sensor", unitPrice: 86 },
  { name: "Transmission fluid", unitPrice: 34 },
];

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
    const catalogItem = JOB_CATALOG[(Number(order.id.replace(/\D/g, "")) + index) % JOB_CATALOG.length];
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
    const catalogItem = PART_CATALOG[(Number(order.id.replace(/\D/g, "")) + index) % PART_CATALOG.length];
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

function buildOrderDetailsRegistry(): OrderDetails[] {
  return ordersFixture.map((orderFixture) => {
    const order = toOrderListItem(orderFixture);
    const customer = customersFixture.find((item) => item.id === order.customerId);
    const vehicle = vehiclesFixture.find((item) => item.id === order.vehicleId);
    const jobs = buildOrderJobs(order);
    const parts = buildOrderParts(order, jobs);

    return {
      ...order,
      flagged: order.priority === "high" || order.status === "waiting_parts",
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
  });
}

function findOrderDetails(orderId: string) {
  return buildOrderDetailsRegistry().find((order) => order.id === orderId);
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
];
