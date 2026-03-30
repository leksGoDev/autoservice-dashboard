import { act, renderHook, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";

import { useCreateOrderFlowMutation } from "../api/mutations";
import { useCreateOrderBootstrapQuery } from "../api/queries";
import { useCreateOrderFormModel } from "./use-create-order-form";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../api/mutations", () => ({
  useCreateOrderFlowMutation: vi.fn(),
}));

vi.mock("../api/queries", () => ({
  useCreateOrderBootstrapQuery: vi.fn(),
}));

const mockedUseNavigate = vi.mocked(useNavigate);
const mockedUseCreateOrderFlowMutation = vi.mocked(useCreateOrderFlowMutation);
const mockedUseCreateOrderBootstrapQuery = vi.mocked(useCreateOrderBootstrapQuery);

function fillValidExistingSelectionForm(model: ReturnType<typeof useCreateOrderFormModel>) {
  model.form.setValue("customerMode", "existing");
  model.form.setValue("existingCustomerId", "cust_001");
  model.form.setValue("vehicleMode", "existing");
  model.form.setValue("scheduledFor", "2026-03-30T11:00");
  model.form.setValue("complaint", "Engine makes abnormal noise");
  model.form.setValue("assignedMechanic", "Artem Bondar");
  model.form.setValue("priority", "high");
  model.form.setValue("status", "scheduled");
  model.form.setValue("initialJobs.0.name", "Initial diagnostics");
  model.form.setValue("initialJobs.0.category", "Diagnostics");
  model.form.setValue("initialJobs.0.estimatedHours", 1);
  model.form.setValue("initialJobs.0.laborPrice", 120);
}

describe("useCreateOrderFormModel", () => {
  beforeEach(() => {
    mockedUseNavigate.mockReturnValue(vi.fn());
    mockedUseCreateOrderBootstrapQuery.mockReturnValue({
      customers: [{ id: "cust_001", fullName: "Aleksey Volkov" }],
      vehicles: [
        { id: "veh_001", customerId: "cust_001" },
        { id: "veh_002", customerId: "cust_002" },
      ],
      mechanics: ["Artem Bondar"],
      isLoading: false,
      hasError: false,
      isVehiclesLoading: false,
      isMechanicsLoading: false,
      hasVehiclesError: false,
      hasMechanicsError: false,
      refetch: vi.fn(),
    } as never);
  });

  it("blocks submission when selected existing vehicle belongs to another customer", async () => {
    const mutateAsync = vi.fn().mockResolvedValue({ id: "ord_999" });

    mockedUseCreateOrderFlowMutation.mockReturnValue({
      mutateAsync,
      isPending: false,
    } as never);

    const { result } = renderHook(() => useCreateOrderFormModel());

    act(() => {
      fillValidExistingSelectionForm(result.current);
    });

    await waitFor(() => {
      expect(result.current.form.getValues("existingVehicleId")).toBe("");
    });

    act(() => {
      result.current.form.setValue("existingVehicleId", "veh_002");
    });

    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() => {
      expect(result.current.submitError).toBe("Selected vehicle belongs to another customer");
    });
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("forces new vehicle mode when customer mode is switched to new", async () => {
    mockedUseCreateOrderFlowMutation.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as never);

    const { result } = renderHook(() => useCreateOrderFormModel());

    act(() => {
      result.current.form.setValue("vehicleMode", "existing");
      result.current.form.setValue("customerMode", "new");
    });

    await waitFor(() => {
      expect(result.current.vehicleMode).toBe("new");
    });
  });

  it("resets selected existing vehicle when another customer is selected", async () => {
    mockedUseCreateOrderFlowMutation.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as never);

    const { result } = renderHook(() => useCreateOrderFormModel());

    act(() => {
      result.current.form.setValue("customerMode", "existing");
      result.current.form.setValue("existingCustomerId", "cust_001");
      result.current.form.setValue("vehicleMode", "existing");
      result.current.form.setValue("existingVehicleId", "veh_001");
    });

    act(() => {
      result.current.form.setValue("existingCustomerId", "cust_002");
    });

    await waitFor(() => {
      expect(result.current.form.getValues("existingVehicleId")).toBe("");
    });
  });

  it("does not reset selected existing vehicle on vehicle mode toggles", async () => {
    mockedUseCreateOrderFlowMutation.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as never);

    const { result } = renderHook(() => useCreateOrderFormModel());

    act(() => {
      result.current.form.setValue("customerMode", "existing");
      result.current.form.setValue("existingCustomerId", "cust_001");
      result.current.form.setValue("vehicleMode", "existing");
      result.current.form.setValue("existingVehicleId", "veh_001");
    });

    act(() => {
      result.current.form.setValue("vehicleMode", "new");
      result.current.form.setValue("vehicleMode", "existing");
    });

    await waitFor(() => {
      expect(result.current.form.getValues("existingVehicleId")).toBe("veh_001");
    });
  });
});
