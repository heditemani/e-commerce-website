# Atelier e-commerce starter

A TypeScript storefront starter built with Next.js App Router, Prisma, PostgreSQL, Zustand, and cookie-based JWT sessions.

## Get started

1. Install Node.js 20.9 or newer and PostgreSQL.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and a random `AUTH_SECRET` (at least 32 characters).
3. Install dependencies and initialize the database:

   ```sh
   npm install
   npx prisma migrate dev --name init
   npm run db:seed
   npm run dev
   ```

4. Visit `http://localhost:3000`, create a customer account, and try the demo checkout. Payment is simulated; no card information is collected.

The seed script creates the starter categories. To grant an account product/order administration access, set its `role` to `ADMIN` in the database. Public sign-up never grants administrator privileges.

## API overview

- `GET /api/products` — category, price, search, sort (`popular`, `newest`, `price-asc`, `price-desc`), and pagination filters.
- `GET /api/products/:slug` — product detail.
- `POST /api/products`, `PATCH /api/products/:slug`, `DELETE /api/products/:slug` — administrator product management.
- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` — account/session endpoints.
- `GET /api/orders` — current customer's orders (all orders for administrators).
- `POST /api/orders` — authenticated checkout; validates stock and calculates prices on the server in a database transaction.
- `PATCH /api/orders` — administrator order status update (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).

Prices are stored as integer cents. The demo estimates tax at 8% and shipping at $8, with free shipping at $100. Update these policies and connect a payment provider before production use.
