# AI Context Document

> **Purpose**: Provide AI models with essential project context for faster, more precise assistance.
> **Last Updated**: December 2024

## Quick Reference

| Aspect              | Value                                 |
| ------------------- | ------------------------------------- |
| **Package Manager** | `bun` (lockfile: `bun.lock`)          |
| **Run Commands**    | Use `make <target>` or `bun <script>` |
| **Framework**       | TanStack Start (React 19 + SSR)       |
| **Database**        | PostgreSQL via Drizzle ORM            |
| **Auth**            | Better Auth (social login)            |
| **Styling**         | Tailwind CSS v4 + shadcn/ui           |
| **Validation**      | Zod v4                                |
| **State**           | Zustand (client cart)                 |

---

## ⚠️ Critical Rules

1. **ALWAYS use `bun` or `make`** - Never use `npm` or `pnpm` commands
2. **File-based routing** - Route structure in `src/routes/` determines URLs
3. **Server functions** - Use `createServerFn` from TanStack Start for server code
4. **Schema changes** - Run `make db-push` after modifying Drizzle schemas
5. **Type safety** - Run `make check` before committing (format + lint + types)

---

## Project Structure

```bash
tanstack-ecom/
├── src/
│   ├── routes/                    # File-based routing (TanStack Router)
│   │   ├── __root.tsx            # Root layout with providers
│   │   ├── (shop)/               # Public store pages (no auth required)
│   │   │   ├── index.tsx         # Homepage
│   │   │   ├── products/         # Product listing & detail
│   │   │   ├── categories/       # Category pages
│   │   │   ├── cart.tsx          # Shopping cart
│   │   │   ├── checkout.tsx      # Checkout flow
│   │   │   └── order-confirmation.tsx
│   │   ├── (auth-pages)/         # Login/signup pages
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   ├── (authenticated)/      # Protected user pages
│   │   │   ├── account/          # User account management
│   │   │   └── dashboard/        # User dashboard
│   │   └── api/                  # API routes
│   │       └── auth/$.ts         # Better Auth handler
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives (Button, Input, etc.)
│   │   └── shop/                 # E-commerce components (ProductCard, MiniCart)
│   ├── lib/
│   │   ├── auth/                 # Authentication setup
│   │   │   ├── auth.ts          # Better Auth server config
│   │   │   ├── auth-client.ts   # Client-side auth hooks
│   │   │   └── middleware.ts    # Auth middleware
│   │   ├── db/
│   │   │   ├── index.ts         # Database connection
│   │   │   └── schema/          # Drizzle schemas
│   │   │       ├── auth.schema.ts      # Auth tables (auto-generated)
│   │   │       └── ecommerce.schema.ts # E-commerce tables
│   │   ├── server/              # Server-side functions
│   │   │   ├── products.ts      # Product queries
│   │   │   └── orders.ts        # Order management
│   │   ├── validations/         # Zod schemas
│   │   │   ├── checkout.ts      # Checkout validation
│   │   │   └── products.ts      # Product validation
│   │   └── cart/
│   │       └── cart-store.ts    # Zustand cart state
│   └── env/                     # Type-safe env variables
├── drizzle/                     # Migration files
├── docs/                        # Documentation
│   └── PRD.md                   # Product requirements
└── Makefile                     # Development shortcuts
```

---

## Key Commands

### Development

```bash
make dev          # Start dev server at localhost:3000
make build        # Production build
make check        # Run format + lint + type-check
```

### Database

```bash
make db-up        # Start PostgreSQL container
make db-push      # Apply schema changes (dev)
make db-studio    # Open Drizzle Studio GUI
make db-generate  # Create migration files
```

### Common Shortcuts

```bash
make db-products  # Query products table
make db-orders    # Query orders table
make db-users     # Query users table
```

---

## Database Schema (Key Tables)

### E-commerce Entities

| Table        | Purpose            | Key Fields                                 |
| ------------ | ------------------ | ------------------------------------------ |
| `product`    | Product catalog    | name, slug, price, compareAtPrice, stock   |
| `category`   | Product categories | name, slug, parentId (self-referential)    |
| `order`      | Customer orders    | orderNumber, status, total, shippingZone   |
| `order_item` | Order line items   | orderId, productId, quantity, price        |
| `cart`       | Shopping carts     | userId (nullable for guests), sessionId    |
| `cart_item`  | Cart contents      | cartId, productId, quantity                |
| `address`    | User addresses     | userId, street, city, province, postalCode |
| `wishlist`   | Saved products     | userId, productId                          |
| `review`     | Product reviews    | userId, productId, rating, comment         |
| `coupon`     | Discount codes     | code, discountType, discountValue          |

### Enums

```typescript
orderStatusEnum: "pending" |
  "paid" |
  "processing" |
  "shipped" |
  "delivered" |
  "cancelled" |
  "refunded";
paymentMethodEnum: "mercadopago" | "cash_on_delivery" | "bank_transfer";
shippingZoneEnum: "amba" | "interior" | "pickup";
```

---

## Code Patterns

### Server Functions (TanStack Start)

```typescript
import { createServerFn } from "@tanstack/start";

export const getProducts = createServerFn({ method: "GET" })
  .validator(z.object({ categoryId: z.string().optional() }))
  .handler(async ({ data }) => {
    // Server-side code with database access
    return await db.select().from(product);
  });
```

### Route with Loader

```typescript
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(shop)/products/")({
  loader: async () => {
    return await getProducts();
  },
  component: ProductsPage,
});

function ProductsPage() {
  const products = Route.useLoaderData();
  // ...
}
```

### Zustand Store (Cart)

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        /* ... */
      },
      removeItem: (productId) => {
        /* ... */
      },
      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" },
  ),
);
```

### Zod Validation

```typescript
import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.email(),
  shippingZone: z.enum(["amba", "interior", "pickup"]),
  address: addressSchema.optional(),
});
```

---

## Environment Variables

Required in `.env`:

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/ecom
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BETTER_AUTH_SECRET=generated-secret  # Run: make auth-secret
```

---

## Argentine Market Specifics

- **Currency**: ARS (Argentine Peso)
- **Shipping Zones**:
  - `amba`: Buenos Aires metropolitan area
  - `interior`: Rest of Argentina
  - `pickup`: Store pickup
- **Payment**: Mercado Pago (primary), bank transfer, cash on delivery
- **Installments**: "Cuotas sin interés" (interest-free installments)

---

## Common Tasks

### Add a New Route

1. Create file in `src/routes/` following naming convention
2. Export `Route` using `createFileRoute`
3. Routes regenerate automatically (`routeTree.gen.ts`)

### Add a shadcn/ui Component

```bash
make ui  # Then follow prompts
# Or: bun dlx shadcn@latest add <component>
```

### Modify Database Schema

1. Edit `src/lib/db/schema/ecommerce.schema.ts`
2. Run `make db-push` (development)
3. For production: `make db-generate` then `make db-migrate`

### Add Validation Schema

1. Create/edit in `src/lib/validations/`
2. Export from `src/lib/validations/index.ts`
3. Use with `.validator()` in server functions

---

## Current Status (MVP Progress)

### ✅ Completed

- Product catalog with categories
- Shopping cart (Zustand + localStorage)
- User authentication (Google OAuth)
- Checkout flow with shipping zones
- Order creation and confirmation
- Basic account pages

### 🔲 In Progress

- Mercado Pago integration
- Email notifications (Resend)
- Admin panel

### 📋 Planned

- Inventory management
- Advanced search/filters
- Reviews system
- Wishlist functionality
