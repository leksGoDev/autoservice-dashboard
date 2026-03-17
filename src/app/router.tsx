import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppShell } from "./layouts/AppShell";
import { AnalyticsPage } from "../pages/analytics/AnalyticsPage";
import { CustomersPage } from "../pages/customers/CustomersPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { MechanicsPage } from "../pages/mechanics/MechanicsPage";
import { OrdersPage } from "../pages/orders/OrdersPage";
import { VehiclesPage } from "../pages/vehicles/VehiclesPage";
import { WorkBoardPage } from "../pages/work-board/WorkBoardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/dashboard" />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
        handle: { title: "Dashboard" },
      },
      {
        path: "orders",
        element: <OrdersPage />,
        handle: { title: "Orders" },
      },
      {
        path: "customers",
        element: <CustomersPage />,
        handle: { title: "Customers" },
      },
      {
        path: "vehicles",
        element: <VehiclesPage />,
        handle: { title: "Vehicles" },
      },
      {
        path: "mechanics",
        element: <MechanicsPage />,
        handle: { title: "Mechanics" },
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
        handle: { title: "Analytics" },
      },
      {
        path: "work-board",
        element: <WorkBoardPage />,
        handle: { title: "Work Board" },
      },
    ],
  },
]);
