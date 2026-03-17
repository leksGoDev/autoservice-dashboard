# DESIGN_SYSTEM.md
# Autoservice Operations Dashboard — Design System

## Overview

This document defines the visual design system for the Autoservice Operations Dashboard.

Goals of the design system:

- provide a clean enterprise-style dashboard UI
- maintain visual consistency across the application
- support data-heavy interfaces (tables, charts, dashboards)
- introduce subtle BMW Motorsport-inspired accents without overwhelming the interface

The design is **dark theme first** and optimized for desktop dashboards.

---

# Design Principles

The interface should feel like a professional internal operations tool.

Core principles:

- clean
- readable
- data-focused
- minimal decoration
- consistent spacing
- subtle branding accents

The UI must prioritize **clarity of information over visual effects**.

---

# Styling Approach

The project uses Tailwind CSS.

Guidelines:

- prefer utility classes over custom CSS
- avoid inline styles
- map design tokens to Tailwind config
- keep visual decisions consistent across widgets, pages, and shared UI primitives

---

# Design Tokens

Recommended token naming:

- `--color-bg`
- `--color-surface`
- `--color-card`
- `--color-border`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-muted`
- `--color-accent-light-blue`
- `--color-accent-dark-blue`
- `--color-accent-red`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--color-info`

These tokens should be reflected in Tailwind theme configuration.

---

# Color System

## Base Colors (Dark UI)

Background and structural colors.

Background:
#0F1115

Surface:
#151922

Card:
#1B2130

Borders:
#2A3142

---

## Text Colors

Primary text:
#E6EAF2

Secondary text:
#9AA4B2

Muted text:
#6B7280

---

## BMW Motorsport Accent Colors

Used sparingly as visual accents.

Light Blue:
#6BA4FF

Dark Blue:
#003A8F

Red:
#E7222A

These colors may appear in:

- progress indicators
- charts
- highlights
- selected states
- subtle gradients

They should **never dominate the UI**.

---

## Functional Status Colors

Success:
#22C55E

Warning:
#F59E0B

Danger:
#EF4444

Info:
#3B82F6

---

# Typography

Primary font:

Inter

Alternative options:

Geist
Manrope

Font hierarchy:

Heading
Section Title
Table Header
Body Text
Small Meta Text

Text should prioritize readability in dense data interfaces.

---

# Spacing System

Use a consistent spacing scale.

Recommended spacing values:

- 4px
- 8px
- 12px
- 16px
- 24px
- 32px

Prefer an 8px-based spacing rhythm for layout, cards, forms, and table toolbars.

---

# Layout

Standard dashboard layout:

Sidebar
Top Navigation Bar
Main Content Area

The layout should support large data tables and analytical views.

---

# Sidebar

The sidebar contains main navigation.

Sidebar background:
#0B0E14

Active item:
accent highlight

Hover state:
subtle surface color change

Navigation sections:

Dashboard
Orders
Customers
Vehicles
Mechanics
Analytics
Work Board

---

# Cards

Cards are the primary container for widgets and metrics.

Card style:

background: #1B2130
border: 1px solid #2A3142
border-radius: 12px
padding: consistent spacing

Cards may contain:

- charts
- tables
- metrics
- activity feeds

---

# Tables

Tables are one of the core UI elements.

Table characteristics:

- compact rows
- subtle borders
- row hover states
- sortable columns
- status badges
- priority indicators

Row hover background:
#20283A

---

# Status Badges

Status indicators help visualize system states.

Example order statuses:

Scheduled
In Progress
Waiting Parts
Completed
Cancelled

Each status should have a distinct color indicator.

---

# Priority Indicators

Order priority levels:

Low
Medium
High
Urgent

Example colors:

Low:
neutral gray

Medium:
blue

High:
BMW blue accent

Urgent:
red

---

# KPI Cards

KPI cards display key metrics on the dashboard.

Examples:

Active Orders
Scheduled Orders
Revenue Today
Overdue Orders

Each card contains:

- label
- large numeric value
- optional trend indicator

---

# Charts

Charts visualize operational metrics.

Supported chart types:

Line Chart
Bar Chart
Stacked Bar Chart
Pie Chart (limited usage)

Recommended chart palette:

Light Blue
Dark Blue
Red
Green
Amber

Charts should remain readable on dark backgrounds.

---

# Interaction States

Common interaction states:

Hover
Focus
Active
Disabled

Interactions should be subtle and avoid heavy animations.

---

# Empty States

When no data exists, show a clear empty state with:

- message
- optional icon
- guidance for next action

---

# Loading States

Loading states should use skeleton loaders for:

- tables
- cards
- charts

This improves perceived performance.

---

# Error States

Error states should include:

- short message
- retry option

---

# Summary

The design system aims to combine:

- enterprise dashboard clarity
- dark modern UI
- subtle BMW Motorsport accents

The interface should feel like a professional internal tool used to manage real operations.
