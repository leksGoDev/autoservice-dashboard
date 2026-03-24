# Autoservice Operations Dashboard — Code Conventions

## Overview

This document defines file-level coding conventions for the frontend codebase.

It covers:

- React component declaration style
- JSX control-flow rules
- custom hook usage
- naming preferences
- styling usage inside files
- small abstraction preferences
- presentation formatting rules

This document complements `ARCHITECTURE.md`.

`ARCHITECTURE.md` defines macro structure and dependency rules.

This document defines how code should be written inside that structure.

---

## React Components

Component rules:

- prefer arrow function components for consistency across the codebase
- define props through explicit `type` or `interface`
- do not use `FC` as a default component style
- use `FC` only when it provides real value, such as an intentional `children` contract already aligned with the surrounding code
- prefer named exports for React modules unless a framework constraint requires default export

Preferred shape:

```tsx
type ExampleProps = {
  title: string;
};

export const Example = ({ title }: ExampleProps) => {
  return <section>{title}</section>;
};
```

---

## JSX Control Flow

Rendering rules:

- allow only simple ternary expressions in JSX
- avoid nested or hard-to-read ternary operators inside component JSX
- prefer early returns for mutually exclusive screen states such as loading, error, and empty
- when markup branches become large, extract a helper component or dedicated rendering block
- keep JSX declarative and easy to scan
- do not duplicate a shared layout shell only to force early returns
- when loading, error, empty, and success states share the same page or widget shell, keep the shell once and extract the varying content into a dedicated component or rendering block
- if early return would duplicate the same `section`, header, toolbar, or other shared wrapper, prefer decomposition over copy-paste
- do not replace one readability problem with another: a huge ternary and duplicated early-return branches are both considered bad outcomes

Preferred direction:

- small conditional inline: acceptable
- large conditional branch: use early return
- repeated or bulky conditional markup: extract component or helper block
- repeated state branches with a shared shell: extract a content component and keep the shell single

---

## Custom Hooks

Hook rules:

- extract custom hooks when a component accumulates non-trivial state orchestration, derived view-model logic, or event coordination
- use custom hooks to separate page orchestration from presentational rendering
- prefer hooks for reusable stateful behavior over inline ad hoc logic duplicated across screens
- keep hooks focused on one concern and return a clear view model for the component layer
- for details routes, keep `pages/model` hooks focused on reading route params only
- place query orchestration and view-model shaping in `widgets/*/model`, even when the widget is used by a single page
- use `pages/model` for route concerns such as params, search params, and URL synchronization only
- avoid passing large prop bundles from pages to widgets; prefer a route id plus widget-owned model logic

Good candidates for custom hooks:

- filters and pagination state
- query and mutation wiring
- reusable interaction state
- derived presentation-friendly data

Avoid:

- creating hooks only to wrap a couple of local constants
- moving tiny one-off logic into a hook with no reuse or readability gain

---

## Widget Structure

Widget structure should reflect the actual complexity of the module.

Rules:

- use a single file when the widget is still small and readable
- introduce `ui/` only when the widget has multiple private subcomponents
- introduce `model/` only when the widget has meaningful widget-local logic
- keep the entry component easy to find, typically as `WidgetName.tsx`
- avoid mixing several organizational styles inside one widget without a strong reason
- clean up empty folders after moving files during refactors

---

## Naming

Naming should optimize for fast recognition of responsibility.

Rules:

- hooks use the `useXxx` shape
- React components use PascalCase
- props types use `XxxProps`
- formatting helpers use verbs such as `formatXxx`, `getXxxLabel`, `buildXxxOptions`
- booleans should read like booleans, for example `isLoading`, `hasFilters`, `canEdit`
- avoid vague names such as `data`, `item`, `helper`, or `utils` when a more specific name is available

Translation key naming should stay hierarchical and predictable.

Recommended examples:

- `nav.dashboard`
- `topbar.searchPlaceholder`
- `dashboard.kpi.activeOrders`
- `order.status.in_progress`
- `order.priority.high`
- `common.justNow`

---

## Styling In Code

The project uses Tailwind CSS together with CSS Modules.

Rules:

- use Tailwind for utility composition and common layout primitives
- use CSS Modules for scoped custom styling when a component or page needs isolated CSS
- keep `app`-level global styles limited to reset, theme tokens, and app-wide layout concerns
- co-locate `*.module.css` with the React module that owns the markup
- avoid adding feature-specific UI styling to `global.css`

Use CSS Modules when:

- custom styling grows beyond a few utility classes
- the component needs local visual states or richer selectors
- readability would suffer from large utility-only `className` blocks

Use Tailwind when:

- composing layout
- applying spacing
- aligning content
- using small visual utilities
- expressing simple, local presentational changes

---

## Local Abstractions

Abstractions should reduce complexity, not move it around.

Rules:

- do not extract a helper or component when the inline version is still clearer
- do not create shared utilities for a single local use case
- prefer keeping small one-off logic close to the component that owns it
- extract code when repetition, branching, or naming clarity makes the result easier to understand
- avoid generic `utils.ts` dumping grounds

---

## Presentation Formatting

Presentation rules:

- avoid formatting labels, dates, statuses, and repeated display strings inline in multiple JSX locations
- prefer named helpers for repeated presentation transforms
- keep user-facing strings centralized through i18n or dedicated formatting helpers
- avoid duplicating the same display mapping in several files

---

## Scope

These conventions apply to:

- `pages`
- `widgets`
- `features`
- `entities`
- `shared`

They should guide ongoing refactoring work and all new implementation inside the frontend codebase.
