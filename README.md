# Autoservice Operations Dashboard

Portfolio-grade frontend project that simulates a production-like B2B operations dashboard for an auto service business.

The application is focused on real frontend architecture and product flows rather than demo CRUD. It uses a mocked backend powered by MSW and demonstrates how a complex internal dashboard can be structured, localized, tested, and prepared for deployment.

## Highlights

- Operations-focused dashboard with realistic internal-tool structure
- Orders registry, order details, and service execution flows
- Customers and vehicles management with linked domain data
- Appointments workflow before conversion into active orders
- Work board for operational status tracking
- Global search across orders, customers, and vehicles
- English and Russian UI localization
- PWA support through `vite-plugin-pwa`
- Production-like mocked backend with MSW
- Strong automated test coverage

## Main Product Areas

- Dashboard
- Orders
- Order Details
- Create Order
- Appointments
- Customers
- Customer Details
- Vehicles
- Vehicle Details
- Mechanics
- Analytics
- Work Board

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
- lucide-react

## Architecture

The project follows a layered modular structure:

```txt
app
shared
entities
features
widgets
pages
mocks
```

Key architectural principles:

- thin route pages
- reusable widgets and feature-level interaction flows
- entity-local API logic
- TanStack Query for server state
- mocked backend isolated in MSW handlers and in-memory state
- styling via Tailwind CSS with scoped CSS Modules where custom CSS is justified

See the detailed project docs:

- [PRODUCT.md](docs/PRODUCT.md)
- [UI_SYSTEM.md](docs/UI_SYSTEM.md)
- [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)
- [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [CODE.md](docs/CODE.md)
- [API.md](docs/API.md)
- [PWA.md](docs/PWA.md)

## Localization

Supported locales:

- English (`en`)
- Russian (`ru`)

The selected language is applied across navigation, page titles, widgets, forms, status labels, and state messages.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

## Current Verification

Latest local verification completed successfully:

- `npm run build`
- `npm test`

Current test status:

- `78` test files
- `266` tests

## Why This Project Exists

This project is intended as a portfolio piece that demonstrates:

- product thinking for internal tools
- frontend architecture for medium-complexity React applications
- modular organization beyond simple CRUD pages
- realistic mocked API integration
- localization, testing, and PWA polish in the same codebase

## Publishing Notes

The repository is ready for GitHub publication after:

- adding the GitHub remote
- pushing the current `master`
- choosing a deployment target such as Vercel or Netlify
- adding deployment-specific SPA routing configuration if needed

## License

This repository is currently unlicensed.
