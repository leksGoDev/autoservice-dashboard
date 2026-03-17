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

- drag and drop orders between statuses
- quick status updates
- visual workload overview

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

## Key Workflows

### Create Order

- create new order
- assign customer and vehicle
- set initial status

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

---

## Main Screens

The application includes:

- Dashboard
- Orders (registry)
- Order Details
- Work Board
- Customers
- Vehicles

No separate Appointments page is included.

Appointments are represented as orders with a pre-service status.

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
