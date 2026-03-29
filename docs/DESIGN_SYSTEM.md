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

The project uses Tailwind CSS together with CSS Modules.

Guidelines:

- use Tailwind for utility-first composition such as layout, spacing, alignment, sizing, and common visual primitives
- use co-located `*.module.css` files when custom component styling needs local scope and isolation
- keep global styles limited to resets, tokens, base typography, and truly app-wide layout primitives
- avoid adding new feature-specific selectors to the global stylesheet
- avoid inline styles unless a dynamic value cannot be expressed cleanly through class switching
- keep visual decisions consistent across widgets, pages, and shared UI primitives

Tailwind baseline:

- the project currently uses Tailwind v4 through `@tailwindcss/vite`
- there is no custom `tailwind.config` scale in the repository at the moment
- default Tailwind spacing, radius, and typography utilities are the primary source of truth
- arbitrary values such as `text-[13px]` or `rounded-[10px]` are allowed only for the documented dense-dashboard exceptions below
- do not introduce new arbitrary sizes casually; if a new size repeats across the app, either align it to the approved set or document the reason first

CSS ownership rules:

- `global.css` is for reset, CSS variables, and application-wide structural rules only
- component-specific custom CSS should live next to the component that owns the markup
- page-specific custom CSS should live inside the page module rather than in shared global styles
- reusable visual patterns may have shared CSS Modules when they are intentionally cross-page primitives
- CSS Modules complement Tailwind utilities rather than replace them

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

These tokens should be reflected in shared CSS variables and reused consistently across CSS Modules.

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

Approved typography scale:

- `text-[11px]` for compact meta text, dense inline row controls, and micro helper labels only
- `text-xs` (`12px`) for field labels, table headers, chips, compact buttons, and small secondary metadata
- `text-[13px]` for dense table body content and compact dashboard list rows
- `text-sm` (`14px`) for standard body copy, inputs, and descriptive text
- `text-[28px]` for page titles
- `text-[30px]` for KPI values
- `text-[32px]` only for large placeholder or hero-style headings

Typography rules:

- prefer default Tailwind text sizes first
- use `text-[11px]` and `text-[13px]` intentionally for dense data-heavy UI, not as general-purpose body sizes
- do not use `text-[12px]` when `text-xs` expresses the same size
- avoid inventing nearby one-off values such as `12.5px`, `15px`, `27px`, or `29px`
- when a screen does not need dense compaction, prefer `text-xs` and `text-sm` over arbitrary text sizes

Localization requirements:

- the primary type choice must support both Latin and Cyrillic text cleanly
- translated Russian labels must remain readable in dense dashboard layouts
- components should account for longer Russian strings without breaking hierarchy
- truncation should be deliberate and used only where layout pressure requires it

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

Approved Tailwind spacing usage:

- `gap-1`, `gap-2`, `gap-3`, `gap-4` for most local composition
- `px-2`, `px-2.5`, `px-3`, `px-4` for controls and compact table actions
- `py-1`, `py-1.5`, `py-2`, `py-2.5`, `py-3` for controls, badges, and table rows
- `p-3`, `p-4`, `p-6` for cards and larger sections

Spacing rules:

- prefer Tailwind default spacing steps first
- `2.5`, `3.5`, and similar half-steps are acceptable when they are already part of Tailwind's scale and improve dense dashboard fit
- avoid arbitrary spacing values unless they are tied to a repeated visual pattern already used in shared UI
- dense row actions and table controls should stay in the compact range rather than using large form spacing by default

Approved radius usage:

- `rounded-lg` and `rounded-xl` for most compact containers
- `rounded-2xl` for page-level cards and large shells
- `rounded-full` for chips and pills
- `rounded-[10px]` is the preferred dashboard-specific control radius
- `rounded-[8px]` may remain only for very small inline controls where `10px` feels oversized
- `rounded-[9px]` should not be introduced as an ongoing pattern

Radius rule:

- do not introduce new one-off radii such as `9px`, `11px`, `14px`, or `18px` without a clear repeated pattern

---

# Layout

Standard dashboard layout:

Sidebar
Top Navigation Bar
Main Content Area

The layout should support large data tables and analytical views.

The top navigation bar should include a visible `EN` / `RU` language switcher.

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

Sidebar item sizing and spacing should tolerate longer localized labels, especially in Russian.

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

Table sizing rules:

- table body content should typically use `text-[13px]`
- table headers should typically use `text-xs`
- compact inline row controls may use `text-[11px]`
- default row padding should stay in the compact range around `px-3 py-2` or `px-3 py-2.5`
- avoid placing large form-style controls inside registry rows unless the table is intentionally acting as a workspace

Row hover background:
#20283A

---

# Localization UI Behavior

Localization should feel native to the interface rather than added on top of it.

Guidelines:

- keep the active language visibly selected in the top bar
- prefer a direct two-option switch over a hidden dropdown for the current language scope
- ensure translated headings, status chips, and control labels remain visually balanced
- avoid layouts that rely on short English-only labels
- verify that widgets, tables, and toolbars remain aligned with longer Russian copy

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

Control sizing rules:

- default compact button and input pattern should stay around `rounded-[10px] px-3 py-2`
- larger form actions may use `px-4 py-2.5`
- tiny inline confirmation or row action controls may use `h-7 w-7` or similarly compact dimensions
- avoid mixing `text-xs`, `text-[12px]`, and `text-[13px]` in one control family without a reason; pick one level for the pattern and repeat it
- if a control starts needing much larger padding or height, treat it as a deliberate prominent action rather than the default baseline

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
