import { httpRequest } from "@/shared/api/http-client";
import { createVehicle, getVehiclesList } from "./requests";

vi.mock("@/shared/api/http-client", () => ({
  httpRequest: vi.fn(),
}));

const mockedHttpRequest = vi.mocked(httpRequest);

describe("vehicle requests", () => {
  beforeEach(() => {
    mockedHttpRequest.mockReset();
  });

  it("sends list request with GET method and empty query by default", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [], page: 1, pageSize: 10, total: 0, totalPages: 1 });

    getVehiclesList();

    expect(mockedHttpRequest).toHaveBeenCalledWith("/vehicles", {
      method: "GET",
      query: {
        page: undefined,
        pageSize: undefined,
        search: undefined,
      },
    });
  });

  it("passes provided query params", () => {
    mockedHttpRequest.mockResolvedValueOnce({ items: [], page: 2, pageSize: 5, total: 0, totalPages: 1 });

    getVehiclesList({
      page: 2,
      pageSize: 5,
      search: "tesla",
    });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/vehicles", {
      method: "GET",
      query: {
        page: 2,
        pageSize: 5,
        search: "tesla",
      },
    });
  });

  it("creates vehicle with POST payload", () => {
    mockedHttpRequest.mockResolvedValueOnce({ id: "veh_006" });

    createVehicle({
      customerId: "cust_001",
      vin: "1HGCM82633A123099",
      plateNumber: "TX-9001",
      make: "Honda",
      model: "Civic",
      year: 2023,
    });

    expect(mockedHttpRequest).toHaveBeenCalledWith("/vehicles", {
      method: "POST",
      body: {
        customerId: "cust_001",
        vin: "1HGCM82633A123099",
        plateNumber: "TX-9001",
        make: "Honda",
        model: "Civic",
        year: 2023,
      },
    });
  });
});
