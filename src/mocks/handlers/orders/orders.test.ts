import { ordersFixture } from "@/mocks/fixtures/orders";

async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

async function patchJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

async function deleteJson(url: string) {
  const response = await fetch(url, {
    method: "DELETE",
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

describe("ordersHandlers", () => {
  it("filters by status, applies search, and paginates", async () => {
    const data = await getJson("/api/orders?status=in_progress&search=ORD-10&page=1&pageSize=2");

    expect(data.page).toBe(1);
    expect(data.pageSize).toBe(2);
    expect(data.total).toBeGreaterThan(0);
    expect(data.items).toHaveLength(2);
    expect(data.items.every((item: { status: string }) => item.status === "in_progress")).toBe(true);
  });

  it("sorts by totalAmount ascending", async () => {
    const data = await getJson("/api/orders?sortBy=totalAmount&sortDirection=asc&page=1&pageSize=50");

    const amounts = data.items.map((item: { totalAmount: number }) => item.totalAmount);
    const sorted = [...amounts].sort((a, b) => a - b);

    expect(amounts).toEqual(sorted);
    expect(data.total).toBe(ordersFixture.length);
  });

  it("guards invalid page and pageSize", async () => {
    const data = await getJson("/api/orders?page=0&pageSize=0");

    expect(data.page).toBe(1);
    expect(data.pageSize).toBe(1);
    expect(data.items).toHaveLength(1);
  });

  it("applies priority, mechanic and created date filters", async () => {
    const data = await getJson(
      "/api/orders?priority=high&assignedMechanic=Ivan%20Petrov&createdFrom=2026-03-01&createdTo=2026-03-31&page=1&pageSize=50",
    );

    expect(
      data.items.every(
        (item: { priority: string; assignedMechanic: string; createdAt: string }) =>
          item.priority === "high" &&
          item.assignedMechanic === "Artem Bondar" &&
          new Date(item.createdAt).getTime() >= new Date("2026-03-01T00:00:00.000Z").getTime() &&
          new Date(item.createdAt).getTime() <= new Date("2026-03-31T23:59:59.999Z").getTime(),
      ),
    ).toBe(true);
  });

  it("returns order details payload", async () => {
    const data = await getJson("/api/orders/ord_001");

    expect(data.id).toBe("ord_001");
    expect(data.customer).toEqual(
      expect.objectContaining({
        id: "cust_001",
        fullName: "Aleksey Volkov",
      }),
    );
    expect(data.vehicle).toEqual(
      expect.objectContaining({
        id: "veh_001",
        plateNumber: expect.any(String),
      }),
    );
    expect(data.jobs.length).toBeGreaterThan(0);
    expect(data.parts.length).toBeGreaterThan(0);
  });

  it("returns chronological order activity", async () => {
    const data = await getJson("/api/orders/ord_001/activity");

    expect(data.length).toBeGreaterThan(0);

    const timestamps = data.map((item: { timestamp: string }) => new Date(item.timestamp).getTime());
    const sorted = [...timestamps].sort((left, right) => right - left);

    expect(timestamps).toEqual(sorted);
  });

  it("updates order status and returns updated details/list snapshots", async () => {
    const patchResponse = await patchJson("/api/orders/ord_002/status", { status: "in_progress" });
    const details = await getJson("/api/orders/ord_002");
    const list = await getJson("/api/orders?search=ORD-1002&page=1&pageSize=1");

    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.status).toBe("in_progress");
    expect(details.status).toBe("in_progress");
    expect(list.items[0].status).toBe("in_progress");
  });

  it("updates assigned mechanic and keeps data consistent in details and work board cards", async () => {
    const patchResponse = await patchJson("/api/orders/ord_001", { assignedMechanic: "Nikolai Volkov" });
    const details = await getJson("/api/orders/ord_001");
    const workBoard = await getJson("/api/work-board");
    const boardCard = workBoard.columns
      .flatMap((column: { cards: { orderId: string; assignedMechanic: string }[] }) => column.cards)
      .find((card: { orderId: string }) => card.orderId === "ord_001");

    expect(patchResponse.status).toBe(200);
    expect(details.assignedMechanic).toBe("Nikolai Volkov");
    expect(boardCard?.assignedMechanic).toBe("Nikolai Volkov");
  });

  it("updates flag state via dedicated endpoint", async () => {
    const patchResponse = await patchJson("/api/orders/ord_003/flag", { flagged: false });
    const details = await getJson("/api/orders/ord_003");

    expect(patchResponse.status).toBe(200);
    expect(details.flagged).toBe(false);
  });

  it("returns validation errors for invalid mutation payload", async () => {
    const response = await patchJson("/api/orders/ord_001/status", { status: "invalid_status" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Invalid");
  });

  it("validates add service job payload", async () => {
    const invalid = await postJson("/api/orders/ord_001/jobs", {
      name: "",
      category: "Maintenance",
      estimatedHours: 0,
      laborPrice: -10,
    });

    expect(invalid.status).toBe(400);
    expect(invalid.body.message).toContain("Invalid service job payload");
  });

  it("validates job status payload", async () => {
    const before = await getJson("/api/orders/ord_001");
    const jobId = before.jobs[0].id as string;
    const invalid = await patchJson(`/api/jobs/${jobId}/status`, { status: "done" });

    expect(invalid.status).toBe(400);
    expect(invalid.body.message).toContain("Invalid service job status");
  });

  it("validates add part payload", async () => {
    const before = await getJson("/api/orders/ord_001");
    const jobId = before.jobs[0].id as string;
    const invalid = await postJson(`/api/jobs/${jobId}/parts`, {
      name: "Coolant",
      quantity: 0,
      unitPrice: 26,
    });

    expect(invalid.status).toBe(400);
    expect(invalid.body.message).toContain("Invalid job part payload");
  });

  it("validates update part quantity payload", async () => {
    const before = await getJson("/api/orders/ord_001");
    const partId = before.parts[0].id as string;
    const invalid = await patchJson(`/api/job-parts/${partId}`, { quantity: 0 });

    expect(invalid.status).toBe(400);
    expect(invalid.body.message).toContain("quantity must be a positive integer");
  });

  it("adds service job and updates details summary values", async () => {
    const before = await getJson("/api/orders/ord_001");
    const created = await postJson("/api/orders/ord_001/jobs", {
      name: "Cooling system flush",
      category: "Maintenance",
      estimatedHours: 1.5,
      laborPrice: 170,
      assignedMechanic: "Artem Bondar",
    });
    const after = await getJson("/api/orders/ord_001");
    const activity = await getJson("/api/orders/ord_001/activity");

    expect(created.status).toBe(201);
    expect(after.jobs.length).toBe(before.jobs.length + 1);
    expect(after.jobsCount).toBe(before.jobsCount + 1);
    expect(after.totalAmount).toBeGreaterThan(before.totalAmount);
    expect(activity[0].type).toBe("job_added");
  });

  it("updates job status and assigns mechanic to job", async () => {
    const before = await getJson("/api/orders/ord_001");
    const jobId = before.jobs[0].id as string;

    const statusUpdate = await patchJson(`/api/jobs/${jobId}/status`, { status: "completed" });
    const mechanicUpdate = await patchJson(`/api/jobs/${jobId}/assign-mechanic`, {
      assignedMechanic: "Nikolai Volkov",
    });
    const after = await getJson("/api/orders/ord_001");
    const activity = await getJson("/api/orders/ord_001/activity");
    const targetJob = after.jobs.find((job: { id: string }) => job.id === jobId);

    expect(statusUpdate.status).toBe(200);
    expect(mechanicUpdate.status).toBe(200);
    expect(targetJob?.status).toBe("completed");
    expect(targetJob?.assignedMechanic).toBe("Nikolai Volkov");
    expect(activity.some((item: { type: string }) => item.type === "job_status_updated")).toBe(true);
    expect(activity.some((item: { type: string }) => item.type === "job_mechanic_assigned")).toBe(true);
  });

  it("adds part, updates quantity, and removes part with timeline updates", async () => {
    const before = await getJson("/api/orders/ord_001");
    const jobId = before.jobs[0].id as string;

    const addPart = await postJson(`/api/jobs/${jobId}/parts`, {
      name: "Coolant",
      quantity: 2,
      unitPrice: 26,
    });
    const addedPartId = addPart.body.parts.find((part: { name: string }) => part.name === "Coolant").id as string;

    const updateQty = await patchJson(`/api/job-parts/${addedPartId}`, { quantity: 4 });
    const remove = await deleteJson(`/api/job-parts/${addedPartId}`);
    const after = await getJson("/api/orders/ord_001");
    const activity = await getJson("/api/orders/ord_001/activity");

    expect(addPart.status).toBe(201);
    expect(updateQty.status).toBe(200);
    expect(remove.status).toBe(200);
    expect(after.parts.some((part: { id: string }) => part.id === addedPartId)).toBe(false);
    expect(activity.some((item: { type: string }) => item.type === "part_added")).toBe(true);
    expect(activity.some((item: { type: string }) => item.type === "part_quantity_updated")).toBe(true);
    expect(activity.some((item: { type: string }) => item.type === "part_removed")).toBe(true);
  });

  it("creates order and returns it in list and details endpoints", async () => {
    const created = await postJson("/api/orders", {
      customerId: "cust_001",
      vehicleId: "veh_001",
      scheduledFor: "2026-03-25T09:30:00.000Z",
      complaint: "Rattle noise while idling",
      notes: "Please inspect suspension first",
      priority: "high",
      status: "scheduled",
      assignedMechanic: "Artem Bondar",
      initialJobs: [
        {
          name: "Initial diagnostics",
          category: "Diagnostics",
          estimatedHours: 1.5,
          laborPrice: 160,
        },
      ],
    });

    const list = await getJson("/api/orders?page=1&pageSize=50");
    const details = await getJson(`/api/orders/${created.body.id}`);
    const activity = await getJson(`/api/orders/${created.body.id}/activity`);

    expect(created.status).toBe(201);
    expect(created.body.id).toContain("ord_");
    expect(list.items.some((item: { id: string }) => item.id === created.body.id)).toBe(true);
    expect(details.complaint).toBe("Rattle noise while idling");
    expect(details.jobs.length).toBe(1);
    expect(activity.some((item: { type: string }) => item.type === "order_created")).toBe(true);
  });
});
