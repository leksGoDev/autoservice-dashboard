async function getJson(url: string) {
  const response = await fetch(url);
  return response.json();
}

export {};

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

async function postJson(url: string) {
  const response = await fetch(url, {
    method: "POST",
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

describe("appointmentsHandlers", () => {
  it("filters appointments by status and mechanic", async () => {
    const data = await getJson("/api/appointments?status=confirmed&assignedMechanic=Ivan%20Petrov&page=1&pageSize=20");

    expect(data.total).toBeGreaterThan(0);
    expect(data.items.every((item: { status: string; assignedMechanic: string }) => item.status === "confirmed" && item.assignedMechanic === "Ivan Petrov")).toBe(true);
  });

  it("updates appointment status and schedule", async () => {
    const before = await getJson("/api/appointments/apt_001");
    const updatedSchedule = new Date(new Date(before.scheduledFor).getTime() + 2 * 60 * 60 * 1000).toISOString();

    const response = await patchJson("/api/appointments/apt_001", {
      status: "confirmed",
      scheduledFor: updatedSchedule,
    });
    const after = await getJson("/api/appointments/apt_001");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("confirmed");
    expect(after.scheduledFor).toBe(updatedSchedule);
  });

  it("converts appointment to order and archives appointment", async () => {
    const beforeAppointments = await getJson("/api/appointments?page=1&pageSize=50");
    const beforeOrders = await getJson("/api/orders?page=1&pageSize=100");

    const conversion = await postJson("/api/appointments/apt_003/convert-to-order");

    const afterAppointments = await getJson("/api/appointments?page=1&pageSize=50");
    const convertedOrder = await getJson(`/api/orders/${conversion.body.orderId}`);
    const afterOrders = await getJson("/api/orders?page=1&pageSize=100");

    expect(conversion.status).toBe(200);
    expect(afterAppointments.total).toBe(beforeAppointments.total - 1);
    expect(afterAppointments.items.some((item: { id: string }) => item.id === "apt_003")).toBe(false);
    expect(afterOrders.total).toBe(beforeOrders.total + 1);
    expect(convertedOrder.number).toBe(conversion.body.orderNumber);
    expect(convertedOrder.status).toBe("scheduled");
  });

  it("returns validation error for invalid patch payload", async () => {
    const response = await patchJson("/api/appointments/apt_001", {
      status: "wrong_status",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Invalid appointment status");
  });

  it("rejects converted status for patch updates", async () => {
    const response = await patchJson("/api/appointments/apt_001", {
      status: "converted",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Invalid appointment status");
  });
});
