import { httpRequest } from "@/shared/api/http-client";
import {
  convertAppointmentToOrder,
  getAppointmentDetails,
  getAppointmentsList,
  updateAppointment,
} from "./requests";

vi.mock("@/shared/api/http-client", () => ({
  httpRequest: vi.fn(),
}));

const mockedHttpRequest = vi.mocked(httpRequest);

describe("appointment requests", () => {
  beforeEach(() => {
    mockedHttpRequest.mockReset();
  });

  it("sends list request with GET method and empty query by default", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [], page: 1, pageSize: 10, total: 0, totalPages: 1 });

    getAppointmentsList();

    expect(mockedHttpRequest).toHaveBeenCalledWith("/appointments", {
      method: "GET",
      query: {
        page: undefined,
        pageSize: undefined,
        search: undefined,
        status: undefined,
        assignedMechanic: undefined,
        scheduledFrom: undefined,
        scheduledTo: undefined,
        sortBy: undefined,
        sortDirection: undefined,
      },
    });
  });

  it("passes provided query params", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [], page: 2, pageSize: 5, total: 0, totalPages: 1 });

    getAppointmentsList({
      page: 2,
      pageSize: 5,
      status: "confirmed",
      assignedMechanic: "Artem Bondar",
      scheduledFrom: "2026-03-01",
      scheduledTo: "2026-03-31",
      sortBy: "scheduledFor",
      sortDirection: "asc",
    });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/appointments", {
      method: "GET",
      query: {
        page: 2,
        pageSize: 5,
        search: undefined,
        status: "confirmed",
        assignedMechanic: "Artem Bondar",
        scheduledFrom: "2026-03-01",
        scheduledTo: "2026-03-31",
        sortBy: "scheduledFor",
        sortDirection: "asc",
      },
    });
  });

  it("loads details by id", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "apt_001" });

    getAppointmentDetails("apt_001");

    expect(mockedHttpRequest).toHaveBeenCalledWith("/appointments/apt_001", {
      method: "GET",
    });
  });

  it("updates appointment", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "apt_001", status: "confirmed" });

    updateAppointment("apt_001", {
      status: "confirmed",
      scheduledFor: "2026-03-25T10:00:00.000Z",
    });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/appointments/apt_001", {
      method: "PATCH",
      body: {
        status: "confirmed",
        scheduledFor: "2026-03-25T10:00:00.000Z",
      },
    });
  });

  it("converts appointment to order", () => {
    mockedHttpRequest.mockResolvedValueOnce({ appointmentId: "apt_001", orderId: "ord_013", orderNumber: "ORD-1013" });

    convertAppointmentToOrder("apt_001");

    expect(mockedHttpRequest).toHaveBeenCalledWith("/appointments/apt_001/convert-to-order", {
      method: "POST",
    });
  });
});
