# E-commerce Frontend Structure

## Overview

Complete frontend structure for the Argentine e-commerce application built with TanStack Router, React 19, and TypeScript. The application features a modern storefront with user authentication, shopping cart, and account management.

## Architecture

### Route Groups

#### `(shop)/` - Public Storefront
Public-facing pages for browsing and shopping:

- **`route.tsx`** - Layout component with ShopHeader, ShopFooter, and MiniCart
- **`index.tsx`** - Homepage with hero section, featured products, and categories
- **`products/index.tsx`** - Product listing with filters and sorting
- **`products/$slug.tsx`** - Individual product detail pages
- **`categories/index.tsx`** - Category grid view
- **`categories/$slug.tsx`** - Products filtered by category
- **`cart.tsx`** - Shopping cart page
- **`checkout.tsx`** - Checkout form (requires authentication)
- **`search.tsx`** - Search results page

#### `(authenticated)/account/` - User Account (Protected)
User account management pages:

- **`route.tsx`** - Account layout with sidebar navigation
- **`index.tsx`** - Account dashboard with quick stats
- **`orders.tsx`** - Order history list
- **`orders.$orderId.tsx`** - Detailed order view with tracking
- **`addresses.tsx`** - Saved shipping addresses management
- **`wishlist.tsx`** - User wishlist/favorites

### Components

#### `components/shop/`
Reusable components for the storefront:

- **`shop-header.tsx`** - Navigation header with:
  - Logo and branding
  - Search bar (desktop/mobile)
  - Cart icon with item count
  - User menu (login/signup or account)
  - Categories navigation
  - Free shipping banner

- **`shop-footer.tsx`** - Footer with:
  - Company information
  - Links (about, contact, help)
  - Social media links
  - Newsletter signup

- **`product-card.tsx`** - Product display card with:
  - Product image with hover effects
  - Name, price, and discount badges
  - Rating and review count
  - Add to cart/wishlist buttons
  - Quick actions overlay

- **`mini-cart.tsx`** - Slide-in cart sidebar with:
  - Cart items list
  - Quantity controls
  - Subtotal calculation
  - Checkout/cart links

### State Management

#### `lib/cart/cart-context.tsx`
React 19 Context with reducer pattern for cart management:

- **Actions**: Add item, remove item, update quantity, clear cart
- **State**: Items array, cart open/close state
- **Persistence**: LocalStorage integration
- **Calculations**: Item count, subtotal
- **React 19**: Uses `use` hook instead of `useContext`

### Data Fetching

#### `lib/queries/`
TanStack Query integration for server state:

- **`products.ts`** - Product and category queries:
  - `productsQueryOptions()` - Paginated product listing
  - `productQueryOptions(slug)` - Individual product details
  - `featuredProductsQueryOptions()` - Homepage featured products
  - `categoriesQueryOptions()` - Category tree
  - `categoryQueryOptions(slug)` - Category details

- **`account.ts`** - User account queries:
  - `userOrdersQueryOptions()` - Order history
  - `orderQueryOptions(id)` - Order details
  - `userAddressesQueryOptions()` - Saved addresses
  - `userReviewsQueryOptions()` - User reviews
  - `userWishlistQueryOptions()` - Wishlist items

## Argentina-Specific Features

### Currency & Pricing
- ARS (Argentine Peso) formatting with centavos
- "6 cuotas sin interés" (6 interest-free installments) display
- Price ranges in centavos (stored as integers)

### UI/UX Localization
- Spanish language throughout
- Local shipping zones (AMBA, Interior, Pickup)
- Mercado Pago payment integration ready
- DNI/CUIT fields for Argentine users

### Commerce Features
- Free shipping threshold ($50,000 ARS)
- Multiple shipping zones
- Cash on delivery option
- Transfer payment method

## Technical Implementation

### React 19 Features
- `use` hook for context consumption
- Context provider shorthand (`<Context>` instead of `<Context.Provider>`)
- Improved performance and developer experience

### TanStack Router
- File-based routing with route groups
- Protected routes with authentication
- Dynamic routes with slug parameters
- Nested layouts

### TypeScript Integration
- Full type safety across components
- Database schema types integration
- Query result typing
- Context state typing

### Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

## File Structure

```
src/
├── routes/
│   ├── (shop)/
│   │   ├── route.tsx           # Shop layout
│   │   ├── index.tsx           # Homepage
│   │   ├── products/
│   │   │   ├── index.tsx       # Product listing
│   │   │   └── $slug.tsx       # Product detail
│   │   ├── categories/
│   │   │   ├── index.tsx       # Categories grid
│   │   │   └── $slug.tsx       # Category products
│   │   ├── cart.tsx            # Shopping cart
│   │   ├── checkout.tsx        # Checkout form
│   │   └── search.tsx          # Search results
│   └── (authenticated)/account/
│       ├── route.tsx           # Account layout
│       ├── index.tsx           # Dashboard
│       ├── orders.tsx          # Order history
│       ├── orders.$orderId.tsx # Order detail
│       ├── addresses.tsx       # Address management
│       └── wishlist.tsx        # Wishlist
├── components/
│   └── shop/
│       ├── shop-header.tsx     # Navigation header
│       ├── shop-footer.tsx     # Footer
│       ├── product-card.tsx    # Product card
│       └── mini-cart.tsx       # Cart sidebar
└── lib/
    ├── cart/
    │   └── cart-context.tsx    # Cart state management
    └── queries/
        ├── products.ts         # Product queries
        ├── account.ts          # Account queries
        └── index.ts            # Re-exports
```

## Next Steps

### API Integration
- Connect React Query hooks to actual API endpoints
- Implement authentication-protected routes
- Add error handling and loading states

### Mercado Pago Integration
- Payment processing
- Order status updates
- Webhook handling

### Advanced Features
- Product reviews and ratings
- Wishlist functionality
- Order tracking
- Email notifications

### Performance Optimization
- Image optimization
- Code splitting
- Caching strategies
- SEO improvements

## Development Commands

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Database operations
make db-push      # Push schema changes
make db-studio    # Open Drizzle Studio
make db-seed      # Seed database

# Full development environment
make dev-full     # Start all services (db, app, etc.)
```