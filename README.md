# React Store Demo

A demo storefront built with React, TypeScript, and Vite that showcases a modern e-commerce browsing experience backed by the public [Fake Store API](https://fakestoreapi.com/). The project demonstrates product discovery features, cart management with persistence, and a validation-driven checkout flow.

The latest build is deployed to Vercel and can be accessed at https://react-store-demo-six.vercel.app/products for quick previews of the storefront experience.

## Features

- **Product catalog** – Browse items fetched from Fake Store API with responsive cards, loading states, and error handling.
- **Search, filter, and sort** – Quickly find products by keyword, category, or different sorting options (price/title, ascending/descending).
- **Product details** – Dedicated view with imagery, metadata, and add-to-cart actions.
- **Cart management** – Powered by Zustand with local storage persistence, quantity adjustments, totals, and removal helpers.
- **Checkout form** – Built using React Hook Form + Zod for schema-based validation, form errors, and simulated submission.
- **Routing** – Client-side navigation between catalog, product details, cart, and checkout pages via React Router.

## Tech stack

- [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) dev/build tooling
- [Tailwind CSS](https://tailwindcss.com/) via the `@tailwindcss/vite` plugin
- [React Router](https://reactrouter.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for form handling & validation
- ESLint with TypeScript support

## Getting started

Prerequisites: Node.js 20 or newer and npm 10+.

```bash
npm install
npm run dev
```

The development server will print a local URL (typically `http://localhost:5173`) where the app can be viewed. Press `q` or `Ctrl+C` in the terminal to stop the server.

### Available scripts

| Command         | Description                                   |
|-----------------|-----------------------------------------------|
| `npm run dev`   | Start Vite in development mode with HMR        |
| `npm run build` | Type-check and generate a production build     |
| `npm run preview` | Preview the production build locally        |
| `npm run lint`  | Run ESLint using the project configuration     |

## Project structure

```
src/
  api/              # Fetch helpers for Fake Store API resources
  components/       # Shared UI components (header, cards, etc.)
  pages/            # Route-level views (products, cart, checkout)
  store/            # Zustand store for cart state & persistence
  utils/            # Reusable utilities (formatting helpers)
```

Static assets live in `public/`, while Vite configuration lives at the root.

## API usage

All product data is sourced from the public Fake Store API. No API keys are required. For offline development you can replace `fetch` calls in `src/api/products.ts` with mock data or a local JSON server.

## Roadmap & planned enhancements

- User accounts with authenticated checkout and order history.
- Wishlist support and the ability to save carts for later.
- Product reviews & ratings submission flow with optimistic updates.
- Pagination and skeleton loading states for large catalogs.
- Improved accessibility audit and keyboard navigation enhancements.
- Integration tests (Playwright/Cypress) to cover critical flows.

## Contributing

This repository is a demo and does not yet accept external contributions. Feel free to fork it and adapt the storefront to your needs.
