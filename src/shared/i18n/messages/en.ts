export const enMessages = {
  nav: {
    dashboard: "Dashboard",
    orders: "Orders",
    customers: "Customers",
    vehicles: "Vehicles",
    mechanics: "Mechanics",
    analytics: "Analytics",
    workBoard: "Work Board",
  },
  routes: {
    dashboard: "Dashboard",
    orders: "Orders",
    customers: "Customers",
    vehicles: "Vehicles",
    mechanics: "Mechanics",
    analytics: "Analytics",
    workBoard: "Work Board",
  },
  sidebar: {
    eyebrow: "Operations",
    title: "Autoservice Dashboard",
    navAria: "Primary navigation",
  },
  topbar: {
    kicker: "Autoservice Operations",
    searchPlaceholder: "Search orders, customers, vehicles",
    searchAria: "Global search",
    mockReady: "Mock data offline-ready",
    languageLabel: "Language",
  },
  common: {
    retry: "Retry",
    en: "EN",
    ru: "RU",
    unknown: "Unknown",
    active: "active",
  },
  dashboardPage: {
    eyebrow: "Overview",
    title: "Operations Dashboard",
    description: "Live operational snapshot for order flow, revenue, and recent workshop activity.",
    loading: "Loading dashboard data...",
    error: "Failed to load dashboard data.",
    empty: "No dashboard data for selected range.",
  },
  dashboard: {
    kpi: {
      active: "Active Orders",
      overdue: "Overdue Orders",
      scheduled: "Scheduled Orders",
      today: "Revenue Today",
      month: "Revenue This Month",
    },
    revenueChart: {
      title: "Revenue Chart",
      description: "Daily revenue for the latest operational window",
      tooltipRevenue: "Revenue",
    },
    ordersTrend: {
      title: "Orders Trend",
      description: "Created and completed orders by day",
      total: "Total",
      completed: "Completed",
    },
    recentOrders: {
      title: "Recent Orders",
      description: "Latest service orders across all statuses",
      headers: {
        order: "Order",
        customer: "Customer",
        vehicle: "Vehicle",
        status: "Status",
        priority: "Priority",
        mechanic: "Mechanic",
        total: "Total",
        created: "Created",
      },
    },
    recentActivity: {
      title: "Recent Activity",
      description: "Operational changes in chronological order",
    },
    mechanicWorkload: {
      title: "Mechanic Workload",
      description: "Current active workload by mechanic",
    },
  },
  order: {
    status: {
      scheduled: "Scheduled",
      in_progress: "In Progress",
      waiting_parts: "Waiting Parts",
      completed: "Completed",
      cancelled: "Cancelled",
    },
    priority: {
      low: "Low",
      medium: "Medium",
      high: "High",
    },
  },
  pages: {
    orders: {
      eyebrow: "Registry",
      title: "Orders workspace",
      description:
        "Operational registry for service orders with search, filters, table workflows, and row actions.",
      toolbar: {
        aria: "Orders filters toolbar",
        search: "Search",
        searchPlaceholder: "Order number, customer, vehicle",
        status: "Status",
        priority: "Priority",
        mechanic: "Mechanic",
        createdFrom: "Created from",
        createdTo: "Created to",
        all: "All",
        reset: "Reset filters",
      },
      table: {
        headers: {
          number: "Order #",
          customer: "Customer",
          vehicle: "Vehicle",
          status: "Status",
          priority: "Priority",
          mechanic: "Mechanic",
          jobs: "Jobs",
          total: "Total",
          created: "Created",
          actions: "Actions",
        },
        pagination: {
          total: "Total: {{total}}",
          updating: "Updating...",
          prev: "Prev",
          next: "Next",
          page: "Page {{page}} / {{totalPages}}",
        },
        actions: {
          placeholder: "Actions",
        },
      },
      states: {
        loading: "Loading orders...",
        error: "Failed to load orders.",
        empty: "No orders found for selected filters.",
      },
      cards: {
        filtersTitle: "Filters Toolbar",
        filtersText: "Status, priority, mechanic, and date range controls belong here.",
        tableTitle: "Orders Table",
        tableText: "Table columns will match the UI spec and use TanStack Table.",
        actionsTitle: "Row Actions",
        actionsText:
          "Status updates, mechanic assignment, flagging, and details navigation start from this area.",
      },
    },
    customers: {
      eyebrow: "Registry",
      title: "Customers registry",
      description:
        "The customers screen will contain search, a paginated table, and drill-down access to customer details.",
      cards: {
        searchTitle: "Search",
        searchText: "Global and page-level search will reuse shared search behavior.",
        tableTitle: "Customer Table",
        tableText:
          "Columns will include contact information, vehicle count, orders count, and last visit.",
        detailsTitle: "Details Flow",
        detailsText:
          "Customer details, vehicles list, and order history will be added on dedicated routes.",
      },
    },
    vehicles: {
      eyebrow: "Registry",
      title: "Vehicles registry",
      description:
        "The vehicles screen will cover search, vehicle inventory tables, and navigation to service history.",
      cards: {
        tableTitle: "Vehicle Table",
        tableText:
          "Plate number, VIN, make, model, year, owner, and orders count will be tracked here.",
        historyTitle: "Service History",
        historyText: "Vehicle details will surface service history and related orders.",
        patternsTitle: "Shared Patterns",
        patternsText:
          "Loading, empty, and error states will follow the same data-screen conventions as other registries.",
      },
    },
    mechanics: {
      eyebrow: "Operations",
      title: "Mechanics registry",
      description:
        "This screen will hold mechanic status, specialization, active jobs, and workload-related operational context.",
      cards: {
        registryTitle: "Registry",
        registryText: "The mechanics table will support search and operational status tracking.",
        availabilityTitle: "Availability",
        availabilityText: "Mechanic workload data will be shared with dashboard and analytics widgets.",
        assignmentsTitle: "Assignments",
        assignmentsText:
          "Features for assigning mechanics will compose with order and service job flows.",
      },
    },
    analytics: {
      eyebrow: "Insights",
      title: "Analytics workspace",
      description:
        "Analytics will aggregate revenue, orders per day, job categories, mechanic workload, and time-range filters.",
      cards: {
        chartTitle: "Chart Zone",
        chartText:
          "Line, bar, and stacked bar charts will use Recharts on top of prepared query view-models.",
        filtersTitle: "Filters",
        filtersText: "URL-driven time-range controls will keep the screen reproducible and shareable.",
        dataTitle: "Prepared Data",
        dataText: "Heavy chart transformations should stay outside the page layer.",
      },
    },
    workBoard: {
      eyebrow: "Core Feature",
      title: "Work board scaffold",
      description:
        "The work board will become a kanban-style operational screen for moving orders through service statuses.",
      cards: {
        columnsTitle: "Columns",
        columnsText:
          "Scheduled, In Progress, Waiting Parts, and Completed columns will map to order statuses.",
        cardsTitle: "Cards",
        cardsText:
          "Each card will show order number, vehicle, priority, assigned mechanic, and quick actions.",
        interactionsTitle: "Interactions",
        interactionsText: "Drag and drop and quick status updates will be implemented in the next stage.",
      },
    },
  },
} as const;
