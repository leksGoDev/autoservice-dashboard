import { httpRequest } from "@/shared/api/http-client";
import {
  addPartToJob,
  addServiceJob,
  assignServiceJobMechanic,
  assignOrderMechanic,
  createOrder,
  getOrderActivity,
  getOrderDetails,
  getOrdersList,
  removeJobPart,
  setOrderFlag,
  updateJobPartQuantity,
  updateServiceJobStatus,
  updateOrderStatus,
} from "./requests";

vi.mock("@/shared/api/http-client", () => ({
  httpRequest: vi.fn(),
}));

const mockedHttpRequest = vi.mocked(httpRequest);

describe("order requests", () => {
  beforeEach(() => {
    mockedHttpRequest.mockReset();
  });

  it("sends list request with GET method and empty query by default", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [], page: 1, pageSize: 10, total: 0, totalPages: 1 });

    getOrdersList();

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders", {
      method: "GET",
      query: {
        page: undefined,
        pageSize: undefined,
        search: undefined,
        status: undefined,
        priority: undefined,
        assignedMechanic: undefined,
        createdFrom: undefined,
        createdTo: undefined,
        sortBy: undefined,
        sortDirection: undefined,
      },
    });
  });

  it("passes all provided query params", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [], page: 2, pageSize: 20, total: 0, totalPages: 1 });

    getOrdersList({
      page: 2,
      pageSize: 20,
      search: "ford",
      status: "waiting_parts",
      priority: "high",
      assignedMechanic: "Ivan Petrov",
      createdFrom: "2026-03-01",
      createdTo: "2026-03-31",
      sortBy: "updatedAt",
      sortDirection: "asc",
    });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders", {
      method: "GET",
      query: {
        page: 2,
        pageSize: 20,
        search: "ford",
        status: "waiting_parts",
        priority: "high",
        assignedMechanic: "Ivan Petrov",
        createdFrom: "2026-03-01",
        createdTo: "2026-03-31",
        sortBy: "updatedAt",
        sortDirection: "asc",
      },
    });
  });

  it("requests order details by id", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "ord_001" });

    getOrderDetails("ord_001");

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders/ord_001", {
      method: "GET",
    });
  });

  it("requests order activity by id", () => {
    mockedHttpRequest.mockResolvedValueOnce([]);

    getOrderActivity("ord_001");

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders/ord_001/activity", {
      method: "GET",
    });
  });

  it("creates order with POST payload", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "ord_013" });

    createOrder({
      customerId: "cust_001",
      vehicleId: "veh_001",
      scheduledFor: "2026-03-25T09:30:00.000Z",
      complaint: "Engine noise",
      notes: "Check after long trip",
      priority: "high",
      status: "scheduled",
      assignedMechanic: "Ivan Petrov",
      initialJobs: [
        {
          name: "Initial inspection",
          category: "Diagnostics",
          estimatedHours: 1.2,
          laborPrice: 120,
        },
      ],
    });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders", {
      method: "POST",
      body: expect.objectContaining({
        customerId: "cust_001",
        vehicleId: "veh_001",
        complaint: "Engine noise",
      }),
    });
  });

  it("patches order status by id", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "ord_001", status: "completed" });

    updateOrderStatus("ord_001", { status: "completed" });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders/ord_001/status", {
      method: "PATCH",
      body: {
        status: "completed",
      },
    });
  });

  it("patches assigned mechanic by id", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "ord_001", assignedMechanic: "Nikolai Volkov" });

    assignOrderMechanic("ord_001", { assignedMechanic: "Nikolai Volkov" });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders/ord_001", {
      method: "PATCH",
      body: {
        assignedMechanic: "Nikolai Volkov",
      },
    });
  });

  it("patches flagged state by id", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "ord_001", flagged: true });

    setOrderFlag("ord_001", { flagged: true });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders/ord_001/flag", {
      method: "PATCH",
      body: {
        flagged: true,
      },
    });
  });

  it("adds service job for order", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "ord_001" });

    addServiceJob("ord_001", {
      name: "Cooling system flush",
      category: "Maintenance",
      estimatedHours: 1.4,
      laborPrice: 154,
      assignedMechanic: "Ivan Petrov",
    });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/orders/ord_001/jobs", {
      method: "POST",
      body: {
        name: "Cooling system flush",
        category: "Maintenance",
        estimatedHours: 1.4,
        laborPrice: 154,
        assignedMechanic: "Ivan Petrov",
      },
    });
  });

  it("patches service job status", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "ord_001" });

    updateServiceJobStatus("ord_001_job_1", { status: "completed" });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/jobs/ord_001_job_1/status", {
      method: "PATCH",
      body: {
        status: "completed",
      },
    });
  });

  it("patches service job mechanic", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "ord_001" });

    assignServiceJobMechanic("ord_001_job_1", { assignedMechanic: "Nikolai Volkov" });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/jobs/ord_001_job_1/assign-mechanic", {
      method: "PATCH",
      body: {
        assignedMechanic: "Nikolai Volkov",
      },
    });
  });

  it("adds part to service job", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "ord_001" });

    addPartToJob("ord_001_job_1", {
      name: "Coolant",
      quantity: 2,
      unitPrice: 26,
    });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/jobs/ord_001_job_1/parts", {
      method: "POST",
      body: {
        name: "Coolant",
        quantity: 2,
        unitPrice: 26,
      },
    });
  });

  it("patches job part quantity", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "ord_001" });

    updateJobPartQuantity("ord_001_part_1", { quantity: 3 });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/job-parts/ord_001_part_1", {
      method: "PATCH",
      body: {
        quantity: 3,
      },
    });
  });

  it("deletes job part", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "ord_001" });

    removeJobPart("ord_001_part_1");

    expect(mockedHttpRequest).toHaveBeenCalledWith("/job-parts/ord_001_part_1", {
      method: "DELETE",
    });
  });
});
