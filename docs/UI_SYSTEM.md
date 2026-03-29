# UI_SYSTEM.md
# Autoservice Operations Dashboard — UI System

## Overview

This document defines the interface structure of the Autoservice Operations Dashboard.

It describes:

- application layout
- main screens
- page sections
- tables
- forms
- charts
- operational widgets
- shared interaction patterns

This document focuses on **what the user sees and uses**, not on code organization.

---

# Application Layout

The application uses a desktop-first dashboard layout.

Structure:

- left sidebar navigation
- top bar
- main content area

---

## Sidebar Navigation

Primary navigation items:

- Dashboard
- Orders
- Appointments
- Customers
- Vehicles
- Mechanics
- Analytics
- Work Board

The sidebar should support:

- active item state
- icon + label navigation
- compact visual hierarchy

---

## Top Bar

The top bar contains global actions and context.

Expected elements:

- global search
- page title
- language switcher
- optional status indicators
- user menu

### Language Switcher

The top bar contains the primary language control for the application.

Behavior:

- supports only `EN` and `RU`
- uses a direct two-state control such as a segmented switch
- keeps the active language visible at all times
- applies the selected locale immediately across the visible UI
- persists the selected locale between sessions when practical
- may use the browser locale on first load if it matches a supported locale

The language switcher affects:

- sidebar navigation labels
- top bar labels and placeholders
- page titles
- widget titles
- table headers
- form labels
- button labels
- status and priority labels
- empty, loading, and error messages
- relative time text

The following values should not be localized:

- route paths
- order IDs and order numbers
- VIN values
- plate numbers
- customer names
- mechanic names
- raw record values returned from data sources

---

# Main Screens

## Dashboard

The main operational overview screen.

### Main sections

- KPI cards
- revenue chart
- orders trend
- mechanic workload
- recent orders
- recent activity

### KPI cards

Key metrics:

- active orders
- overdue orders
- scheduled orders
- revenue today
- revenue this month

### Dashboard widgets

- Revenue Chart
- Orders Trend Chart
- Mechanic Workload Widget
- Recent Orders Table
- Recent Activity Feed

---

## Orders Page

Primary operational registry.

### Main sections

- filters toolbar
- search
- orders table
- pagination

### Orders table

Columns:

- order number
- customer
- vehicle
- status
- priority
- assigned mechanic
- jobs count
- total cost
- created date

### Order actions

- open details
- change status
- assign mechanic
- flag order

Status and priority values should be presented with localized labels while keeping stable underlying codes in the data layer.

### Filters

- status
- priority
- mechanic
- date range

---

## Order Details Page

Detailed page for a single work order.

### Main sections

- order summary
- customer information
- vehicle information
- service jobs table
- parts list
- activity timeline

### Order summary

Displays:

- order number
- status
- priority
- created date
- assigned mechanic
- total price
- flagged state

### Service jobs table

Columns:

- job name
- category
- status
- assigned mechanic
- estimated hours
- actual hours
- labor price

Main actions:

- add job
- update status
- assign mechanic

### Parts list

Columns:

- part name
- quantity
- unit price
- total price

Main actions:

- add part
- update quantity
- remove part

### Activity timeline

Shows chronological events related to the order.

Examples:

- order created
- order scheduled
- mechanic assigned
- job added
- part added
- status changed
- order completed

---

## Create Order Page

Route-level flow for creating a new service order.

### Main sections

- customer section
- vehicle section
- schedule and notes
- priority and status
- initial service jobs

### Capabilities

- select existing customer
- create customer inline
- select existing vehicle
- create vehicle inline
- define initial order metadata
- submit and open created order details

---

## Appointments Page

Scheduling and pre-service operations screen.

### Main sections

- filters toolbar
- grouped appointments list
- pagination

### Main actions

- confirm appointment
- reschedule appointment
- cancel appointment
- convert appointment to order

### Appointment table

Columns:

- appointment number
- customer
- vehicle
- service
- status
- assigned mechanic
- scheduled time

---

## Customers Page

Customer registry.

### Main sections

- search
- customers table
- pagination

### Customers table

Columns:

- name
- phone
- email
- vehicles count
- orders count
- last visit

---

## Customer Details Page

Customer profile screen.

### Main sections

- customer information
- vehicles list
- order history

---

## Vehicles Page

Vehicle registry.

### Main sections

- search
- vehicles table
- pagination

### Vehicles table

Columns:

- plate number
- VIN
- make
- model
- year
- owner
- orders count

---

## Vehicle Details Page

Vehicle profile screen.

### Main sections

- vehicle information
- service history
- related orders

---

## Mechanics Page

Mechanic registry.

### Main sections

- search
- mechanics table

### Mechanics table

Columns:

- name
- specialization
- active jobs
- status
- experience years

---

## Analytics Page

Operational analytics screen.

### Main sections

- revenue chart
- orders per day
- jobs by category
- mechanic workload
- filter controls for time range

---

## Work Board Page

Operational kanban board for active orders.

### Board columns

- Scheduled
- In Progress
- Waiting Parts
- Completed

### Card content

Each board card should display:

- order number
- vehicle
- priority
- assigned mechanic
- brief status context

### Board actions

- move order between statuses
- open order details
- quick flag action

Drag-and-drop is not required for the current implementation.

---

# Shared UI Patterns

## Localization

All route-level and widget-level interface copy should be translation-driven rather than hardcoded inside page composition.

Formatting rules:

- dates continue to use browser locale behavior
- number formatting keeps existing behavior
- currency stays unchanged
- relative time labels should be localized
 

## Tables

The system relies heavily on registries and data tables.

Expected table behavior:

- sorting
- filtering
- pagination
- row hover state
- row actions
- status and priority indicators

---

## Forms

Forms are used for:

- creating orders
- adding service jobs
- adding parts

---

## Charts

Used on Dashboard and Analytics screens.

Expected chart types:

- line chart
- bar chart
- stacked bar chart
- limited pie chart usage

---

## Search

The application includes global search.

Search targets:

- order number
- vehicle plate
- customer name
- customer phone

---

## Empty States

Each major screen should support empty states when no data is available.

Examples:

- no orders found
- no customers found
- no activity yet

---

## Loading States

Loading states should exist for:

- tables
- widgets
- charts
- detail pages

---

## Error States

Error states should exist for major data-driven areas.

Examples:

- failed to load orders
- failed to load dashboard metrics

---

## Responsive Behavior

The product remains desktop-first, but mobile and narrow widths should degrade predictably.

Rules for narrow layouts:

- horizontal overflow should stay inside local content containers (table wrappers, board wrappers), not at full page level
- dense registries should preserve readability by stacking controls and reducing parallel columns where practical
- action groups in rows and cards should remain tappable and not collapse into unreadable dense clusters
- top bar controls should keep language switcher and global search visible and usable

---

## UI/UX Stabilization Requirements

Core requirements:

- Work Board and Appointments must not produce page-level horizontal overflow on narrow widths
- registry page title hierarchy must be consistent across pages with equivalent role
- table header typography and row vertical rhythm must be consistent across registries
- chart containers must render with stable sizing and no runtime dimension warnings
- long forms and dense registries must remain readable on narrow widths without scope expansion

Acceptance criteria:

- desktop screens keep existing information density
- mobile screens remain usable without horizontal page scrolling
- typography rhythm is consistent across pages with the same hierarchy level

---

## Summary

The UI system is designed as a data-heavy, desktop-first operational dashboard.

The main interface priorities are:

- operational clarity
- fast navigation
- dense but readable information
- smooth registry workflows
- strong support for tables, widgets, and detail pages
