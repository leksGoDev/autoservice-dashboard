import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { WorkBoardColumn } from "@/entities/work-board/model/types";
import { useUpdateOrderStatusMutation } from "@/features/order-operations/api/mutations";
import { I18nProvider } from "@/shared/i18n/provider";
import { WorkBoardColumns } from "./WorkBoardColumns";

vi.mock("@/features/order-operations/api/mutations", () => ({
  useUpdateOrderStatusMutation: vi.fn(),
}));

const mockedUseUpdateOrderStatusMutation = vi.mocked(useUpdateOrderStatusMutation);

function renderColumns(columns: WorkBoardColumn[]) {
  render(
    <MemoryRouter>
      <I18nProvider>
        <WorkBoardColumns columns={columns} />
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe("WorkBoardColumns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("runs order status mutation for each quick action", async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);

    mockedUseUpdateOrderStatusMutation.mockReturnValue({
      mutateAsync,
      isPending: false,
    } as never);

    renderColumns([
      {
        status: "scheduled",
        cards: [
          {
            id: "wb_ord_001",
            orderId: "ord_001",
            orderNumber: "ORD-1001",
            status: "scheduled",
            priority: "medium",
            customerName: "Aleksey Volkov",
            vehicleLabel: "2019 Honda Accord",
            assignedMechanic: "Artem Bondar",
            jobsCount: 2,
            totalAmount: 680,
            shortContext: "2 jobs | Updated 09:10",
            updatedAt: "2026-03-18T09:10:00.000Z",
            availableActions: ["start_work", "reschedule"],
          },
        ],
      },
      {
        status: "in_progress",
        cards: [
          {
            id: "wb_ord_002",
            orderId: "ord_002",
            orderNumber: "ORD-1002",
            status: "in_progress",
            priority: "high",
            customerName: "Pavel Petrov",
            vehicleLabel: "2020 BMW X3",
            assignedMechanic: "Ivan Makarov",
            jobsCount: 3,
            totalAmount: 940,
            shortContext: "3 jobs | Updated 10:20",
            updatedAt: "2026-03-18T10:20:00.000Z",
            availableActions: ["wait_parts", "complete"],
          },
        ],
      },
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    fireEvent.click(screen.getByRole("button", { name: "Reschedule" }));
    fireEvent.click(screen.getByRole("button", { name: "Wait parts" }));
    fireEvent.click(screen.getByRole("button", { name: "Complete" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenNthCalledWith(1, { orderId: "ord_001", status: "in_progress" });
      expect(mutateAsync).toHaveBeenNthCalledWith(2, { orderId: "ord_001", status: "scheduled" });
      expect(mutateAsync).toHaveBeenNthCalledWith(3, { orderId: "ord_002", status: "waiting_parts" });
      expect(mutateAsync).toHaveBeenNthCalledWith(4, { orderId: "ord_002", status: "completed" });
    });
  });

  it("renders action error when mutation fails", async () => {
    const mutateAsync = vi.fn().mockRejectedValue(new Error("Unable to update status"));

    mockedUseUpdateOrderStatusMutation.mockReturnValue({
      mutateAsync,
      isPending: false,
    } as never);

    renderColumns([
      {
        status: "scheduled",
        cards: [
          {
            id: "wb_ord_001",
            orderId: "ord_001",
            orderNumber: "ORD-1001",
            status: "scheduled",
            priority: "medium",
            customerName: "Aleksey Volkov",
            vehicleLabel: "2019 Honda Accord",
            assignedMechanic: "Artem Bondar",
            jobsCount: 2,
            totalAmount: 680,
            shortContext: "2 jobs | Updated 09:10",
            updatedAt: "2026-03-18T09:10:00.000Z",
            availableActions: ["start_work"],
          },
        ],
      },
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to update status");
  });
});
