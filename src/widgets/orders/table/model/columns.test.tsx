import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { OrdersTableRow } from "@/widgets/orders/model/types";
import { createOrdersTableColumns } from "./columns";

const t = (key: string) => key;

const row: OrdersTableRow = {
  id: "ord_001",
  number: "ORD-1001",
  customerId: "cust_001",
  customerName: "Alex Turner",
  vehicleId: "veh_001",
  vehicleLabel: "2019 Honda Accord",
  status: "waiting_parts",
  priority: "high",
  flagged: true,
  assignedMechanic: "Ivan Petrov",
  jobsCount: 3,
  totalAmount: 1200,
  createdAt: "2026-03-18T09:35:00.000Z",
};

type TableColumn = {
  id?: string;
  accessorKey?: string;
  cell?: (context: { getValue: () => unknown; row: { original: OrdersTableRow } }) => ReactNode;
};

function findAccessorCell(columns: ReturnType<typeof createOrdersTableColumns>, accessorKey: string) {
  const column = columns.find((item) => (item as TableColumn).accessorKey === accessorKey) as TableColumn | undefined;

  if (!column?.cell) {
    throw new Error(`Cell renderer for accessor "${accessorKey}" was not found.`);
  }

  return column.cell;
}

function findIdCell(columns: ReturnType<typeof createOrdersTableColumns>, id: string) {
  const column = columns.find((item) => (item as TableColumn).id === id) as TableColumn | undefined;

  if (!column?.cell) {
    throw new Error(`Cell renderer for id "${id}" was not found.`);
  }

  return column.cell;
}

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

    const statusCell = findAccessorCell(columns, "status")({
      getValue: () => row.status,
      row: { original: row },
    });
    const priorityCell = findAccessorCell(columns, "priority")({
      getValue: () => row.priority,
      row: { original: row },
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

    const customerCell = findAccessorCell(columns, "customerName")({
      getValue: () => row.customerName,
      row: { original: row },
    });
    const vehicleCell = findAccessorCell(columns, "vehicleLabel")({
      getValue: () => row.vehicleLabel,
      row: { original: row },
    });
    const numberCell = findAccessorCell(columns, "number")({
      getValue: () => row.number,
      row: { original: row },
    });

    const actionCell = findIdCell(columns, "actions")({
      getValue: () => "",
      row: { original: row },
    });

    render(
      <MemoryRouter>
        {customerCell}
        {vehicleCell}
        {numberCell}
        {actionCell}
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Alex Turner" })).toHaveAttribute("href", "/customers/cust_001");
    expect(screen.getByRole("link", { name: "2019 Honda Accord" })).toHaveAttribute("href", "/vehicles/veh_001");
    expect(screen.getByRole("link", { name: "ORD-1001" })).toHaveAttribute("href", "/orders/ord_001");
    expect(screen.getByRole("link", { name: "pages.orders.table.actions.placeholder" })).toBeInTheDocument();
  });

  it("uses custom cell renderers when provided", () => {
    const columns = createOrdersTableColumns(t as never, {
      renderStatusCell: (item) => <span>{`status-${item.id}`}</span>,
      renderMechanicCell: (item) => <span>{`mechanic-${item.id}`}</span>,
      renderRowActions: (item) => <span>{`actions-${item.id}`}</span>,
    });

    const statusCell = findAccessorCell(columns, "status")({
      getValue: () => row.status,
      row: { original: row },
    });
    const mechanicCell = findAccessorCell(columns, "assignedMechanic")({
      getValue: () => row.assignedMechanic,
      row: { original: row },
    });

    const actionCell = findIdCell(columns, "actions")({
      getValue: () => "",
      row: { original: row },
    });

    render(
      <>
        {statusCell}
        {mechanicCell}
        {actionCell}
      </>,
    );
    expect(screen.getByText("status-ord_001")).toBeInTheDocument();
    expect(screen.getByText("mechanic-ord_001")).toBeInTheDocument();
    expect(screen.getByText("actions-ord_001")).toBeInTheDocument();
  });
});
