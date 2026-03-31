# Autoservice Operations Dashboard — API

## Overview

This document defines the API and data layer of the Autoservice Operations Dashboard.

It covers:

- API access strategy
- endpoint groups
- TanStack Query usage
- mutations
- cache invalidation
- DTO and view-model boundaries
- MSW integration at the API level

This document is focused on application data flow and API interaction.

---

## Goals

The data layer should:

- behave as if a real backend exists
- isolate network concerns from UI components
- make mock API and real API interchangeable
- keep server state predictable
- keep query logic consistent and easy to scale

---

## Core Principles

- all network access goes through a shared API client
- UI components must not call `fetch` directly
- TanStack Query owns server state
- server-derived data must not be copied into ad hoc client-side stores
- API response shapes may be mapped into frontend-friendly models when useful
- MSW must mirror the same endpoint contracts used by the frontend
- API and mocks must not return translated interface labels

---

## API Access Structure

Recommended split:

```txt
shared/api/
  http-client.ts
  api-error.ts
  query-keys.ts

entities/*/api/
  request functions
  entity query helpers

features/*/api/
  action-specific mutations when tightly coupled to a feature
```

---

## Shared API Client

A shared API client should be the only place where raw request behavior is defined.

Responsibilities:

- base request configuration
- headers
- JSON parsing
- error conversion
- response normalization if needed

The rest of the application should consume typed request functions rather than raw network calls.

---

## API Endpoint Groups

The frontend should operate against the following endpoint groups.

### Dashboard

```txt
GET /api/dashboard/metrics
GET /api/dashboard/revenue
GET /api/dashboard/orders-trend
GET /api/dashboard/mechanic-workload
GET /api/dashboard/recent-activity
GET /api/dashboard/recent-orders
```

---

### Orders

```txt
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id
PATCH  /api/orders/:id/status
PATCH  /api/orders/:id/flag
```

---

### Order Jobs

```txt
POST   /api/orders/:id/jobs
PATCH  /api/jobs/:id
PATCH  /api/jobs/:id/status
PATCH  /api/jobs/:id/assign-mechanic
```

---

### Job Parts

```txt
POST   /api/jobs/:id/parts
PATCH  /api/job-parts/:id
DELETE /api/job-parts/:id
```

---

### Customers

```txt
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PATCH  /api/customers/:id
```

---

### Vehicles

```txt
GET    /api/vehicles
GET    /api/vehicles/:id
POST   /api/vehicles
PATCH  /api/vehicles/:id
GET    /api/vehicles/:id/service-history
```

---

### Appointments

```txt
GET    /api/appointments
GET    /api/appointments/:id
PATCH  /api/appointments/:id
POST   /api/appointments/:id/convert-to-order
```

---

### Mechanics

```txt
GET    /api/mechanics/registry
GET    /api/mechanics/workload
```

---

### Activity Log

```txt
GET /api/orders/:id/activity
```

---

## Query Strategy

TanStack Query is the single source of truth for server state.

Use it for:

- registries
- detail pages
- dashboard widgets
- analytics widgets
- mutations
- refetching and invalidation

---

## Query Key Strategy

Query keys should be centralized and predictable.

Recommended pattern:

```txt
dashboard.metrics
dashboard.revenue(range)
orders.list(params)
orders.detail(id)
orders.activity(id)
customers.list(params)
customers.detail(id)
vehicles.list(params)
vehicles.detail(id)
vehicles.serviceHistory(id)
appointments.list(params)
mechanics.registry(params)
mechanics.workload()
```

Guidelines:

- key shape must stay stable
- params used in queries should also be represented in keys
- list and detail queries must be clearly separated
- query key naming should remain consistent across the frontend

---

## UI Consumption Rules

UI components should consume query hooks or feature-level mutation hooks instead of calling request functions directly.

Mutation logic should not be defined inline inside page or widget components.

Direct cache manipulation should be limited to mutation handlers and data-layer utilities.

Localization rules:

- request and response contracts should use stable canonical values
- enum values such as statuses and priorities must remain locale-independent
- user-facing labels for those values should be produced in presentation-oriented frontend code
- mock handlers must follow the same locale-independent contract as a real backend
- relative time copy may be localized in the UI layer after data retrieval

---

## List Data Behavior

Registry screens should support API-driven list behavior.

Expected list capabilities:

- pagination
- search
- filtering
- sorting

Typical list params:

- page
- pageSize
- search
- status
- priority
- assignedMechanic
- dateRange
- sortBy
- sortDirection

---

## Detail Data Behavior

Detail pages should use dedicated detail endpoints.

Examples:

- order details
- customer details
- vehicle details

Related sub-data may be loaded through either:

- expanded response shape
- separate dedicated queries

The preferred choice is the one that keeps the UI simple without overloading the initial screen unnecessarily.

---

## Mutation Strategy

Mutations should be action-driven and close to the user interaction that triggers them.

Examples:

- createOrder
- updateOrderStatus
- flagOrder
- addServiceJob
- assignMechanic
- addPartToJob
- convertAppointmentToOrder

Mutations should be encapsulated in feature-level hooks or API modules.

After successful mutation:

- invalidate related list queries
- invalidate related detail queries
- refresh affected dashboard widgets when relevant

Optimistic updates may be used for small, low-risk interactions such as status changes or board movement.

---

## Cache Invalidation Rules

Minimum invalidation expectations:

- order changes invalidate `orders.list` and `orders.detail`
- job changes invalidate related order detail
- part changes invalidate related order detail
- appointment conversion invalidates appointments and orders
- actions affecting dashboard KPIs invalidate dashboard queries

Avoid broad invalidation when a narrower target is sufficient.

---

## DTO and Mapping

The data layer may separate raw transport DTOs from frontend-friendly view models.

This is useful for:

- date parsing
- nested relation flattening
- derived totals
- display-oriented formatting

Examples:

- `created_at` from API may be mapped to a frontend date object or formatted value
- order totals may be exposed as already aggregated numeric values
- customer and vehicle labels may be normalized for display

Keep mapping functions outside UI components.

---

## Error Handling

The data layer should normalize request failures into predictable error shapes.

UI should be able to render:

- loading state
- error state
- empty state
- retry action

Feature-level forms should also support server error rendering when needed.

---

## MSW Role

MSW simulates the backend contract used by the frontend.

At the data-layer level, MSW must:

- expose the same endpoint shapes expected by the UI
- support pagination, filtering, and sorting
- support mutations
- maintain in-memory state between requests
- generate follow-up effects such as activity log events

MSW is an implementation detail of development and demo runtime, not a different API design.

MSW should remain simple and focused on frontend UI needs, not simulate a full backend platform.

---

## MSW Scenarios

The mock API should support a small set of realistic scenarios:

- normal success responses
- artificial delay
- empty list responses
- error responses for selected endpoints

These scenarios help exercise loading, error, and empty states across the UI.

---

## Non-Goals

The data layer should avoid:

- direct network logic in page components
- storing server state outside TanStack Query without a clear need
- tightly coupling UI rendering to raw transport DTOs
- overcomplicated repository-like abstractions without frontend value
- creating different contracts for mock API and future real API
