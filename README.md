# Shopit e-commerce starter

A TypeScript storefront built with Next.js App Router, Prisma, SQLite for local development, Zustand, and cookie-based JWT sessions.

## Get started

1. Install Node.js 20.9 or newer.
2. Install dependencies and initialize the local database, sample catalog, and administrator:

   ```sh
   npm install
   npm run db:setup
   npm run dev
   ```

3. Visit `http://localhost:3000`. Sign in with the admin credentials in your ignored `.env` file and open **Admin** to manage products, stock, and order fulfillment.
4. Customers can create accounts from **Account → Create an account**, then check out. Payment is simulated; no card information is collected.

`npm run db:setup` generates a private `.env`, a random administrator password, migrates the local SQLite database, and seeds sample products. The administrator email is `admin@shopit.local`; its generated password is stored as `ADMIN_PASSWORD` in `.env`. To choose credentials yourself, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` (minimum 12 characters) in `.env` and run `npm run db:admin`. Public sign-up never grants administrator privileges.

## Store pages

The storefront includes `/collections` and category-specific collection pages, `/search`, `/about`, `/contact`, `/faq`, `/shipping`, `/returns`, `/privacy`, and `/terms`. Customer enquiries are stored in the database and can be reviewed and marked read or resolved from the administrator dashboard.

## API overview

- `GET /api/products` — category, price, search, sort (`popular`, `newest`, `price-asc`, `price-desc`), and pagination filters.
- `GET /api/products/:slug` — product detail.
- `POST /api/products`, `PATCH /api/products/:slug`, `DELETE /api/products/:slug` — administrator product management.
- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` — account/session endpoints.
- `GET /api/orders` — current customer's orders (all orders for administrators).
- `POST /api/orders` — authenticated checkout; validates stock and calculates prices on the server in a database transaction.
- `PATCH /api/orders` — administrator order status update (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- `POST /api/contact` — submit a customer enquiry.
- `GET /api/contact`, `PATCH /api/contact` — administrator inbox and enquiry status updates (`NEW`, `READ`, `RESOLVED`).

Prices are stored as integer cents. The demo estimates tax at 8% and shipping at $8, with free shipping at $100. Update these policies and connect a payment provider before production use.
