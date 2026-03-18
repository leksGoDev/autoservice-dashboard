import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppShell } from "./layouts/AppShell";
import { AnalyticsPage } from "../pages/analytics/AnalyticsPage";
import { CustomersPage } from "../pages/customers/CustomersPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { MechanicsPage } from "../pages/mechanics/MechanicsPage";
import { OrdersPage } from "../pages/orders/OrdersPage";
import { VehiclesPage } from "../pages/vehicles/VehiclesPage";
import { VehicleDetailsPage } from "../pages/vehicles/VehicleDetailsPage";
import { WorkBoardPage } from "../pages/work-board/WorkBoardPage";

export const appRoutes = [
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
        handle: { titleKey: "routes.dashboard" },
      },
      {
        path: "orders",
        element: <OrdersPage />,
        handle: { titleKey: "routes.orders" },
      },
      {
        path: "customers",
        element: <CustomersPage />,
        handle: { titleKey: "routes.customers" },
      },
      {
        path: "vehicles",
        element: <VehiclesPage />,
        handle: { titleKey: "routes.vehicles" },
      },
      {
        path: "vehicles/:vehicleId",
        element: <VehicleDetailsPage />,
        handle: { titleKey: "routes.vehicles" },
      },
      {
        path: "mechanics",
        element: <MechanicsPage />,
        handle: { titleKey: "routes.mechanics" },
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
        handle: { titleKey: "routes.analytics" },
      },
      {
        path: "work-board",
        element: <WorkBoardPage />,
        handle: { titleKey: "routes.workBoard" },
      },
    ],
  },
];

export const router = createBrowserRouter(appRoutes);
