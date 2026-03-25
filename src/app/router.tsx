import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppShell } from "./layouts/AppShell";

const DashboardPage = lazy(() =>
  import("../pages/dashboard/DashboardPage").then((module) => ({ default: module.DashboardPage })),
);
const OrdersPage = lazy(() =>
  import("../pages/orders/OrdersPage").then((module) => ({ default: module.OrdersPage })),
);
const OrderDetailsPage = lazy(() =>
  import("../pages/orders/OrderDetailsPage").then((module) => ({ default: module.OrderDetailsPage })),
);
const CustomersPage = lazy(() =>
  import("../pages/customers/CustomersPage").then((module) => ({ default: module.CustomersPage })),
);
const CustomerDetailsPage = lazy(() =>
  import("../pages/customers/CustomerDetailsPage").then((module) => ({ default: module.CustomerDetailsPage })),
);
const VehiclesPage = lazy(() =>
  import("../pages/vehicles/VehiclesPage").then((module) => ({ default: module.VehiclesPage })),
);
const VehicleDetailsPage = lazy(() =>
  import("../pages/vehicles/VehicleDetailsPage").then((module) => ({ default: module.VehicleDetailsPage })),
);
const MechanicsPage = lazy(() =>
  import("../pages/mechanics/MechanicsPage").then((module) => ({ default: module.MechanicsPage })),
);
const AnalyticsPage = lazy(() =>
  import("../pages/analytics/AnalyticsPage").then((module) => ({ default: module.AnalyticsPage })),
);
const WorkBoardPage = lazy(() =>
  import("../pages/work-board/WorkBoardPage").then((module) => ({ default: module.WorkBoardPage })),
);

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
        path: "orders/:orderId",
        element: <OrderDetailsPage />,
        handle: { titleKey: "routes.orders" },
      },
      {
        path: "customers",
        element: <CustomersPage />,
        handle: { titleKey: "routes.customers" },
      },
      {
        path: "customers/:customerId",
        element: <CustomerDetailsPage />,
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
