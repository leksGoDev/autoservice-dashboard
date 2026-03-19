# AGENTS.md

## Project Context

This repository contains a portfolio-grade frontend project: **Autoservice Operations Dashboard**.

It is a production-like B2B internal dashboard for managing an auto service business.

The project is frontend-focused and uses a mocked backend (MSW). It is designed to demonstrate real-world frontend architecture, not a demo CRUD application.

---

## Reference Docs

Use the following documents as the source of truth:

- `PRODUCT.md` — business scope and domain model
- `UI_SYSTEM.md` — screens, pages, and UI structure
- `DESIGN_SYSTEM.md` — visual rules and styling system
- `ARCHITECTURE.md` — code organization and module structure
- `CODE.md` — file-level coding conventions and micro-level frontend rules
- `API.md` — API, TanStack Query, and MSW
- `PWA.md` — PWA behavior and constraints

---

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- MSW
- React Hook Form + Zod
- Zustand
- TanStack Table
- Recharts
- Tailwind CSS
- vite-plugin-pwa

---

## Implementation Rules

- Keep the code modular and production-like
- Keep pages thin and compose them from widgets and features
- Follow the documented architecture and layer boundaries
- Use TanStack Query for all server state
- Do not store server data in Zustand
- Do not call `fetch` directly from UI components
- Keep API logic inside the data layer
- Follow the design system for UI consistency
- Prefer extending existing patterns over creating new ones

---

## Guardrails

- Do not create new documentation files without explicit user approval
- Do not add new root-level files without approval
- Do not introduce new dependencies without approval
- Do not expand project scope on your own
- Do not create parallel architectures or duplicate modules
- Prefer editing existing approved files instead of creating new ones

If a new file or change seems necessary, ask for approval first.

---

## Scope Boundaries

In scope:

- orders
- customers
- vehicles
- appointments
- service jobs
- mechanics
- parts usage
- dashboard metrics
- analytics
- activity timeline
- work board

Out of scope:

- inventory / warehouse
- suppliers
- procurement
- payments
- multi-location management
- full authentication system

---

## Working Style

- Read relevant documentation before implementing changes
- Make minimal necessary changes
- Keep naming consistent with existing patterns
- Avoid speculative abstractions
- Do not refactor unrelated parts of the codebase unless explicitly requested

---

## Priority Rules

If instructions conflict:

1. Follow explicit user instructions
2. Follow AGENTS.md
3. Follow the relevant reference document
