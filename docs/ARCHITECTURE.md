# Autoservice Operations Dashboard — Frontend Architecture

## Overview

This document defines the frontend architecture of the Autoservice Operations Dashboard.

It describes:

- application layers
- module responsibilities
- folder organization
- dependency rules
- routing strategy
- state ownership
- implementation boundaries

It does not describe detailed business logic or visual design decisions.

---

## Architectural Goals

The application should look and feel like a production-like frontend codebase.

Primary goals:

- modular structure
- clear separation of responsibilities
- scalable feature organization
- reusable UI building blocks
- predictable data flow
- easy replacement of mock API with a real backend in the future

---

## Architectural Style

The application uses a modular frontend architecture organized around the following runtime layers:

```txt
app
shared
entities
features
widgets
pages
mocks
```

This structure is chosen to keep business entities, user actions, composite UI blocks, and route screens separated.

---

## Layer Responsibilities

### app

Application bootstrap and global setup.

Contains:

- application entrypoint
- providers
- router setup
- query client setup
- locale provider
- app shell layout
- global styles
- PWA registration

This layer must not contain detailed business logic.

---

### shared

Reusable technical and visual foundation.

Contains:

- generic UI primitives
- utility functions
- constants
- shared hooks
- base table components
- base form components
- shared types
- shared API client
- shared i18n resources and helpers

This layer must not depend on product domains.

---

### entities

Business entities and entity-local logic.

Examples:

- order
- customer
- vehicle
- user
- part
- activity-log

Each entity may contain:

- types
- schemas
- mappers
- request functions
- small entity-specific UI components
- pure helpers

Entities must not depend on pages or large page widgets.

---

### features

Reusable user actions and interaction flows.

Examples:

- create-order
- update-order-status
- assign-mechanic
- add-service-job
- add-part-to-job
- flag-order

A feature may contain:

- action-specific UI
- validation
- mutations
- local interaction state

Features may depend on entities and shared.

---

### widgets

Composite UI blocks used inside pages.

Examples:

- dashboard-kpi-cards
- recent-orders
- orders-table
- order-timeline
- mechanic-workload
- vehicle-service-history

Widgets combine entities, features, and shared UI into page-level blocks.

Widgets should stay reusable across route screens where possible.

Widget structure rules:

- a small widget may stay as a single `Widget.tsx` file
- a composite widget should use an explicit internal structure such as `ui/`, `hooks/`, and optionally `model/`
- use `ui/` only when the widget has multiple private visual parts
- use `hooks/` when widget-local logic is primarily React hook orchestration or view-model state
- use `model/` for pure helpers, options, formatters, or non-hook widget-local logic
- do not add `ui/`, `hooks/`, or `model/` preemptively
- do not keep empty `ui/`, `hooks/`, or `model/` folders
- avoid mixing flat private files and `ui/`, `hooks/`, or `model/` folders inside the same widget without a clear reason

---

### pages

Route-level screens.

Examples:

- dashboard-page
- orders-page
- order-details-page
- customers-page
- vehicles-page
- analytics-page
- work-board-page

Pages compose widgets and features into complete screens.

Pages should stay thin and avoid containing reusable low-level logic.

Page rules:

- pages should primarily compose widgets and route-level concerns
- page hooks in `pages/model` should stay route-focused and prefer params or URL concerns only
- page-ready data orchestration should live in `widgets/*/hooks` or another widget-local hook module, even for single-route widgets
- page-ready visual blocks should live in `widgets`, not in `pages/ui`
- avoid turning `pages` into a second UI layer parallel to `widgets`

---

### mocks

Mock runtime behavior used only during frontend development and showcase operation.

Contains:

- MSW setup
- request handlers
- fixtures
- factories
- in-memory state
- scenario helpers

---

## Dependency Rules

Dependencies should follow the overall direction below:

```txt
pages → widgets → features → entities → shared
app → pages/shared
mocks → shared
```

Rules:

- shared must not depend on entities, features, widgets, or pages
- entities must not depend on widgets or pages
- features may depend on entities and shared
- widgets may depend on features, entities, and shared
- pages may depend on widgets, features, entities, and shared
- app may depend on runtime layers
- mocks may use shared utilities but should not drive app architecture

---

## Suggested Folder Structure

```txt
src/
  app/
  shared/
  entities/
  features/
  widgets/
  pages/
  mocks/
```

Localization resources should live in the shared layer:

```txt
shared/
  i18n/
    config.ts
    provider.tsx
    use-i18n.ts
    messages/
      en.ts
      ru.ts
```

---

## Localization Architecture

Localization is a global UI concern and should be handled at the application level.

Rules:

- support only `en` and `ru`
- default locale is `en`
- the browser locale may be used on first load when it matches a supported locale
- the selected locale should persist locally when practical
- locale changes should update the UI immediately
- locale state should live in an app-level provider/context rather than in server-state tooling
- translation resources should live in `shared/i18n`
- components should consume translations through shared i18n utilities instead of hardcoded labels

Data ownership rules:

- API and mocks return canonical business values and stable enum codes
- entity and API layers keep those stable values unchanged
- localized labels are derived in presentation-oriented frontend code
- shared dictionaries should own common UI labels such as statuses, priorities, and relative time copy

---

## Code Conventions

Macro architecture and dependency rules are defined in this document.

File-level implementation conventions are defined separately in `CODE.md`.

Use `CODE.md` as the source of truth for file-level coding preferences and micro-level implementation rules.

---

## Internal Module Conventions

### Entity module

Example:

```txt
entities/order/
  model/
  api/
  ui/
  lib/
```

Guidelines:

- `model` for types, schemas, enums, and domain helpers
- `api` for entity-related request functions and query helpers
- `ui` for small entity-only visual pieces
- `lib` for pure helper logic

---

### Feature module

Example:

```txt
features/update-order-status/
  ui/
  model/
  api/
```

Guidelines:

- one feature should represent one clear user action
- keep mutation logic close to the feature
- keep validation close to the action that uses it

---

### Widget module

Example:

```txt
widgets/orders-table/
  ui/
  model/
```

Guidelines:

- widget should be a page-ready UI block
- widget may combine shared primitives, entities, and features
- widget should not become a replacement for pages
- if the widget is small, keep it as a single `Widget.tsx` module
- if the widget grows into multiple private parts, split it into `ui/` and optionally `model/`
- `ui/` is appropriate for private subcomponents owned only by that widget
- `model/` is appropriate for widget-local orchestration and derived logic
- do not create `ui/` or `model/` folders unless they provide real clarity
- remove empty internal folders after refactors

---

## Routing Strategy

The application uses React Router.

Recommended routes:

```txt
/
  dashboard
  orders
  orders/:orderId
  customers
  customers/:customerId
  vehicles
  vehicles/:vehicleId
  mechanics
  analytics
  work-board
```

Rules:

- route screens live in `pages`
- details pages use route params
- list pages should use URL search params for filters and pagination where useful
- navigation should be optimized for desktop-first dashboard usage

---

## State Ownership

### Server state

All remote or API-derived data belongs to TanStack Query.

Examples:

- registries
- details data
- dashboard metrics
- analytics data
- mutations and cache invalidation

Server state must not be duplicated in Zustand.

---

### Client UI state

Zustand is used only for UI and interaction state.

Examples:

- sidebar collapsed state
- local board view mode
- temporary UI preferences
- non-URL toggles

---

### Form state

React Hook Form and Zod are used for forms and validation.

Examples:

- create order form
- edit customer form
- add service job form
- add part form

---

## API Access Rule

UI components must not call `fetch` directly.

All network access should go through the data layer and shared API client.

Pages and widgets should consume hooks or action-level abstractions rather than raw requests.

---

## Table Strategy

Tables are one of the primary UI foundations of the project.

Recommended approach:

- generic table primitives in shared UI
- domain-specific column definitions close to widgets or entities
- feature-level actions integrated through row actions
- page or widget level control of filters, sorting, and pagination

---

## Chart Strategy

Charts should be implemented as reusable widgets.

Rules:

- chart containers should have consistent loading, empty, and error states
- page components should not contain heavy transformation logic
- charts should consume already prepared view data

---

## Activity Timeline Strategy

Activity timeline is a reusable order-related widget.

Rules:

- data retrieval belongs to the data layer
- display belongs to widget UI
- formatting helpers belong to shared or entity helpers

---

## PWA Placement

PWA integration belongs to the `app` layer.

It includes:

- manifest registration
- service worker registration
- update prompt integration

PWA is a secondary concern and must not shape the rest of the architecture.

---

## Non-Goals

The architecture should avoid:

- monolithic pages with all logic inside one file
- raw network requests inside page components
- storing server data in Zustand
- shared components containing business logic
- overengineered abstractions that add no frontend value
- backend-oriented complexity outside the scope of the project
