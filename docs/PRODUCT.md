# Autoservice Operations Dashboard — Product

## Overview

This document defines the product scope for the Autoservice Operations Dashboard.

The application is an internal operations tool for managing an autoservice business.

It focuses on:

- order management
- service execution
- customer and vehicle tracking
- operational visibility

The goal is to simulate a realistic B2B dashboard product.

---

## Localization

The application supports two interface languages:

- English (`en`)
- Russian (`ru`)

Product rules:

- English is the default language
- the first load may use the browser language when it matches a supported locale
- the selected language should persist between sessions when practical
- language changes should apply immediately across the interface
- localization applies to UI copy rather than to raw business data

Localized UI copy includes:

- navigation labels
- page titles
- widget titles
- form labels
- placeholders
- status labels
- priority labels
- empty, loading, and error states
- relative time labels

The following values remain unchanged regardless of locale:

- order numbers
- VIN values
- plate numbers
- customer names
- mechanic names
- other record-derived business data

---

## Core Entities

The system operates around the following core entities:

- User (admin, manager, operator, mechanic)
- Customer
- Vehicle
- Order
- ServiceJob
- ServiceCatalog
- Part
- JobPart
- ActivityLog
- DashboardMetrics

---

## Order Model

The Order is the central entity of the system.

It represents the full lifecycle of a service request.

Orders may originate from:

- direct creation
- scheduled appointment (modeled as an order with a pre-service status)

Example statuses:

- scheduled
- in_progress
- waiting_parts
- completed
- cancelled

---

## Service Jobs

Orders consist of multiple service jobs.

Jobs can be created in two ways:

- selected from the Service Catalog
- created as a custom job ("Other")

Each job has:

- name
- status
- assigned mechanic
- cost
- related parts

---

## Parts

Parts are attached to service jobs.

Capabilities:

- add part to job
- update quantity
- remove part
- calculate total cost contribution

---

## Activity Log

The system tracks important actions in the order lifecycle.

Examples:

- status changes
- job updates
- mechanic assignment
- part changes

This is displayed as a timeline in the order details.

---

## Dashboard

The dashboard provides operational visibility.

Includes:

- revenue metrics
- order volume
- orders trend
- mechanic workload (lightweight)
- recent orders
- recent activity

---

## Work Board (Core Feature)

The Work Board is a key operational screen.

It represents orders as columns by status (kanban-style).

Capabilities:

- quick status updates
- visual workload overview

Drag-and-drop is not required for the current project scope.

The board should support clear operational status transitions and fast navigation without relying on DnD.

---

## Customers and Vehicles

The system supports:

- customer registry
- vehicle registry
- vehicle service history

Relationships:

- one customer → multiple vehicles
- one vehicle → multiple orders

---

## Global Search

The system should support global search across:

- orders
- customers
- vehicles

---

## Appointments

The system includes a separate Appointments workflow.

Appointments represent scheduled service visits before they become active work orders.

Capabilities:

- appointment registry
- confirm appointment
- reschedule appointment
- cancel appointment
- convert appointment into order

---

## Key Workflows

### Create Order

- create new order
- assign customer and vehicle
- set initial status
- add initial service jobs
- schedule the visit

The flow may use:

- existing customer and vehicle records
- inline customer creation
- inline vehicle creation

---

### Manage Service Jobs

- add job (from catalog or custom)
- assign mechanic
- update job status
- attach parts

---

### Manage Parts

- add part to job
- update quantity
- remove part

---

### Move Order Through Lifecycle

- update order status
- track progress
- complete order

---

### Work Board Interaction

- move orders between statuses
- reflect real-time state changes

The current product scope does not require drag-and-drop.

---

## Main Screens

The application includes:

- Dashboard
- Orders (registry)
- Create Order
- Order Details
- Appointments
- Work Board
- Customers
- Vehicles

---

## Roles

The system includes roles but does not implement a full admin UI.

Roles may influence behavior but are not the focus of this project.

---

## Non-Goals

The system intentionally avoids:

- full admin panel
- complex permission system
- advanced financial accounting
- warehouse/inventory management system
- offline-first workflows

---

## Summary

This product simulates a realistic autoservice operations dashboard.

It focuses on:

- operational workflows
- service execution
- data visibility

while keeping complexity appropriate for a portfolio-level project.
