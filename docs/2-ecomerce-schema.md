# E-Commerce Database Schema

## Overview

Complete e-commerce schema optimized for Argentina with Mercado Pago integration, ARS pricing, and Cloudflare R2 image storage.

## Argentina-Specific Features

- **Prices in centavos** (integer) - $15,000 ARS = `1500000`
- **Shipping zones**: AMBA, Interior, Pickup
- **Document fields**: DNI/CUIT for invoicing
- **Province field** for all addresses
- **Mercado Pago** payment ID field in orders

## Tables

### Core Tables

| Table             | Purpose                                                             |
| ----------------- | ------------------------------------------------------------------- |
| **category**      | Product categories with nested hierarchy                            |
| **product**       | Products with ARS pricing (centavos), SKU, stock, full-text search  |
| **product_image** | Multiple images per product (Cloudflare R2 URLs)                    |
| **address**       | User shipping addresses with Argentina-specific fields              |
| **cart**          | Shopping carts (supports guest checkout via session ID)             |
| **cart_item**     | Cart line items with quantity and price snapshot                    |
| **order**         | Orders with complete shipping snapshot and Mercado Pago integration |
| **order_item**    | Order line items with product snapshot at purchase time             |
| **review**        | Product reviews with verified purchase support                      |
| **wishlist_item** | User wishlists                                                      |
| **coupon**        | Discount codes (percentage or fixed, with limits)                   |

## Detailed Schema

### Categories (`category`)

```sql
CREATE TABLE category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image TEXT, -- Cloudflare R2 URL
  parent_id UUID REFERENCES category(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Features:**

- Nested categories (parent-child relationship)
- SEO-friendly slugs
- Sortable order
- Active/inactive status

### Products (`product`)

```sql
CREATE TABLE product (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL, -- Price in centavos (ARS)
  compare_at_price INTEGER, -- Optional compare price
  cost_price INTEGER, -- Cost for profit calculations
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  stock INTEGER DEFAULT 0 NOT NULL,
  low_stock_threshold INTEGER DEFAULT 5 NOT NULL,
  track_inventory BOOLEAN DEFAULT TRUE NOT NULL,
  allow_backorder BOOLEAN DEFAULT FALSE NOT NULL,
  weight INTEGER, -- Weight in grams
  category_id UUID REFERENCES category(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  meta_title VARCHAR(70),
  meta_description VARCHAR(160),
  search_vector TEXT, -- Full-text search vector
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Features:**

- ARS pricing in centavos (integer to avoid floating point issues)
- Inventory management with low stock alerts
- Backorder support
- SEO meta fields
- Full-text search (PostgreSQL tsvector)
- Weight for shipping calculations

### Product Images (`product_image`)

```sql
CREATE TABLE product_image (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  url TEXT NOT NULL, -- Cloudflare R2 URL
  alt VARCHAR(255),
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Features:**

- Multiple images per product
- Sortable order
- Cloudflare R2 integration

### Addresses (`address`)

```sql
CREATE TABLE address (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  document_type VARCHAR(10) DEFAULT 'DNI',
  document_number VARCHAR(20),
  street VARCHAR(255) NOT NULL,
  number VARCHAR(20) NOT NULL,
  floor VARCHAR(10),
  apartment VARCHAR(10),
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  notes TEXT,
  shipping_zone shipping_zone_enum DEFAULT 'interior' NOT NULL,
  is_default BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Features:**

- Argentina-specific fields (province, document)
- Shipping zone classification
- Default address support

### Cart (`cart`)

```sql
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES user(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- For guest checkout
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days') NOT NULL
);
```

**Features:**

- Supports both authenticated and guest users
- Automatic expiration (30 days)

### Cart Items (`cart_item`)

```sql
CREATE TABLE cart_item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 NOT NULL,
  price_at_add INTEGER NOT NULL, -- Price snapshot
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Features:**

- Price snapshot at time of adding
- Prevents price changes during checkout

### Orders (`order`)

```sql
CREATE TABLE "order" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE RESTRICT,
  status order_status_enum DEFAULT 'pending' NOT NULL,
  subtotal INTEGER NOT NULL,
  shipping_cost INTEGER DEFAULT 0 NOT NULL,
  discount INTEGER DEFAULT 0 NOT NULL,
  total INTEGER NOT NULL,
  payment_method payment_method_enum NOT NULL,
  payment_id VARCHAR(255), -- Mercado Pago payment ID
  payment_status VARCHAR(50),
  paid_at TIMESTAMP,
  -- Shipping snapshot
  shipping_full_name VARCHAR(100) NOT NULL,
  shipping_phone VARCHAR(20) NOT NULL,
  shipping_street VARCHAR(255) NOT NULL,
  shipping_number VARCHAR(20) NOT NULL,
  shipping_floor VARCHAR(10),
  shipping_apartment VARCHAR(10),
  shipping_city VARCHAR(100) NOT NULL,
  shipping_province VARCHAR(100) NOT NULL,
  shipping_postal_code VARCHAR(10) NOT NULL,
  shipping_zone shipping_zone_enum NOT NULL,
  shipping_notes TEXT,
  -- Tracking
  tracking_number VARCHAR(100),
  tracking_url TEXT,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  -- Notes
  customer_notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Features:**

- Human-readable order numbers (ORD-2024-0001)
- Complete shipping address snapshot
- Mercado Pago integration fields
- Order status tracking
- All prices in centavos

### Order Items (`order_item`)

```sql
CREATE TABLE order_item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES product(id) ON DELETE RESTRICT,
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  product_image TEXT,
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Features:**

- Product snapshot at purchase time
- Prevents data loss if product is deleted

### Reviews (`review`)

```sql
CREATE TABLE review (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  order_id UUID REFERENCES "order"(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL, -- 1-5
  title VARCHAR(100),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Features:**

- Verified purchase reviews
- Admin approval system
- Rating system (1-5 stars)

### Wishlist (`wishlist_item`)

```sql
CREATE TABLE wishlist_item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Coupons (`coupon`)

```sql
CREATE TABLE coupon (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
  discount_value INTEGER NOT NULL,
  minimum_order INTEGER DEFAULT 0 NOT NULL,
  max_discount INTEGER, -- For percentage coupons
  usage_limit INTEGER, -- null = unlimited
  used_count INTEGER DEFAULT 0 NOT NULL,
  per_user_limit INTEGER DEFAULT 1 NOT NULL,
  starts_at TIMESTAMP DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Features:**

- Percentage or fixed amount discounts
- Usage limits and expiration
- Minimum order requirements

## Enums

```sql
CREATE TYPE order_status AS ENUM (
  'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);

CREATE TYPE payment_method AS ENUM (
  'mercadopago', 'cash_on_delivery', 'bank_transfer'
);

CREATE TYPE shipping_zone AS ENUM (
  'amba', 'interior', 'pickup'
);
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX category_slug_idx ON category(slug);
CREATE INDEX category_parent_idx ON category(parent_id);
CREATE INDEX product_slug_idx ON product(slug);
CREATE INDEX product_category_idx ON product(category_id);
CREATE INDEX product_sku_idx ON product(sku);
CREATE INDEX product_active_featured_idx ON product(is_active, is_featured);
CREATE INDEX product_search_idx ON product USING gin(to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, '')));
CREATE INDEX address_user_idx ON address(user_id);
CREATE INDEX cart_user_idx ON cart(user_id);
CREATE INDEX cart_session_idx ON cart(session_id);
CREATE INDEX cart_item_cart_idx ON cart_item(cart_id);
CREATE INDEX cart_item_product_idx ON cart_item(product_id);
CREATE INDEX order_user_idx ON "order"(user_id);
CREATE INDEX order_status_idx ON "order"(status);
CREATE INDEX order_number_idx ON "order"(order_number);
CREATE INDEX order_created_idx ON "order"(created_at);
CREATE INDEX order_item_order_idx ON order_item(order_id);
CREATE INDEX order_item_product_idx ON order_item(product_id);
CREATE INDEX review_product_idx ON review(product_id);
CREATE INDEX review_user_idx ON review(user_id);
CREATE INDEX review_approved_idx ON review(is_approved);
CREATE INDEX wishlist_user_idx ON wishlist_item(user_id);
CREATE INDEX wishlist_product_idx ON wishlist_item(product_id);
CREATE INDEX coupon_code_idx ON coupon(code);
CREATE INDEX coupon_active_idx ON coupon(is_active);
```

## Full-Text Search

The schema includes PostgreSQL full-text search for products:

```sql
-- Search products by name and description
SELECT * FROM product
WHERE search_vector @@ to_tsquery('spanish', 'search:term');

-- With ranking
SELECT *, ts_rank(search_vector, to_tsquery('spanish', 'search:term')) as rank
FROM product
WHERE search_vector @@ to_tsquery('spanish', 'search:term')
ORDER BY rank DESC;
```

## Price Handling (Argentina)

```typescript
// Store prices in centavos (integer)
const priceInCentavos = 1500000; // $15,000 ARS

// Display with proper formatting
new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
}).format(priceInCentavos / 100); // "$15.000"
```

## Next Steps

1. **Set up Mercado Pago integration** (checkout, webhooks)
2. **Create Cloudflare R2** for product images
3. **Build product CRUD API**
4. **Create cart functionality**
5. **Implement order management**</content>
   <parameter name="filePath">/home/vare/project/ecom_202/tanstack-ecom/docs/ecommerce-schema.md
