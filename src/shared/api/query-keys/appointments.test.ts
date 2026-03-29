import { appointmentsQueryKeys } from "./appointments";

describe("appointmentsQueryKeys", () => {
  it("normalizes defaults so equivalent params produce stable keys", () => {
    const keyA = appointmentsQueryKeys.list({});
    const keyB = appointmentsQueryKeys.list({
      page: 1,
      pageSize: 10,
      search: "",
      sortBy: "scheduledFor",
      sortDirection: "asc",
      status: "",
      assignedMechanic: "",
      scheduledFrom: "",
      scheduledTo: "",
    });

    expect(keyA).toEqual(keyB);
  });

  it("includes explicit params in query key", () => {
    const key = appointmentsQueryKeys.list({
      page: 2,
      pageSize: 20,
      search: "bmw",
      sortBy: "createdAt",
      sortDirection: "desc",
      status: "pending",
      assignedMechanic: "Andrey Sokolov",
      scheduledFrom: "2026-03-01",
      scheduledTo: "2026-03-31",
    });

    expect(key).toEqual([
      "appointments",
      "list",
      {
        page: 2,
        pageSize: 20,
        search: "bmw",
        sortBy: "createdAt",
        sortDirection: "desc",
        status: "pending",
        assignedMechanic: "Andrey Sokolov",
        scheduledFrom: "2026-03-01",
        scheduledTo: "2026-03-31",
      },
    ]);
  });

  it("creates detail key", () => {
    expect(appointmentsQueryKeys.detail("apt_001")).toEqual(["appointments", "detail", "apt_001"]);
  });
});
