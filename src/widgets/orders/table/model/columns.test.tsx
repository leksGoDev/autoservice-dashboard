import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { OrdersTableRow } from "@/widgets/orders/shared/model/types";
import { createOrdersTableColumns } from "./columns";

const t = (key: string) => key;

const row: OrdersTableRow = {
  id: "ord_001",
  number: "ORD-1001",
  customerName: "Alex Turner",
  vehicleLabel: "2019 Honda Accord",
  status: "waiting_parts",
  priority: "high",
  assignedMechanic: "Ivan Petrov",
  jobsCount: 3,
  totalAmount: 1200,
  createdAt: "2026-03-18T09:35:00.000Z",
};

describe("createOrdersTableColumns", () => {
  it("creates expected columns list", () => {
    const columns = createOrdersTableColumns(t as never);
    const columnIds = columns.map(
      (column) =>
        (column as { id?: string; accessorKey?: string }).id ??
        (column as { id?: string; accessorKey?: string }).accessorKey,
    );

    expect(columns).toHaveLength(10);
    expect(columnIds).toEqual([
      "number",
      "customerName",
      "vehicleLabel",
      "status",
      "priority",
      "assignedMechanic",
      "jobsCount",
      "totalAmount",
      "createdAt",
      "actions",
    ]);
  });

  it("renders status and priority cells via translation keys", () => {
    const columns = createOrdersTableColumns(t as never);

    const statusCell = (
      columns.find(
        (column) => (column as { accessorKey?: string }).accessorKey === "status",
      ) as any
    ).cell({
      getValue: () => row.status,
    });
    const priorityCell = (
      columns.find(
        (column) => (column as { accessorKey?: string }).accessorKey === "priority",
      ) as any
    ).cell({
      getValue: () => row.priority,
    });

    render(
      <>
        {statusCell}
        {priorityCell}
      </>,
    );

    expect(screen.getByText("order.status.waiting_parts")).toBeInTheDocument();
    expect(screen.getByText("order.priority.high")).toBeInTheDocument();
  });

  it("renders default details link when custom renderer is not provided", () => {
    const columns = createOrdersTableColumns(t as never);

    const actionCell = (columns.find((column) => column.id === "actions") as any).cell({
      row: { original: row },
    });

    render(<MemoryRouter>{actionCell}</MemoryRouter>);

    expect(screen.getByRole("link", { name: "pages.orders.table.actions.placeholder" })).toBeInTheDocument();
  });

  it("uses custom action renderer when provided", () => {
    const columns = createOrdersTableColumns(t as never, (item) => <span>{item.id}</span>);

    const actionCell = (columns.find((column) => column.id === "actions") as any).cell({
      row: { original: row },
    });

    render(<>{actionCell}</>);
    expect(screen.getByText("ord_001")).toBeInTheDocument();
  });
});
