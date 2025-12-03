# Product Requirements Document (PRD)
## Argentine Clothing E-commerce Platform

**Version:** 1.0  
**Date:** December 2024  
**Status:** In Development

---

## 1. Executive Summary

### 1.1 Product Vision
A modern, self-hosted e-commerce platform tailored for an Argentine clothing brand, featuring localized payment methods (Mercado Pago), ARS pricing with installment options, and optimized shipping for Argentina's unique logistics landscape.

### 1.2 Target Users
- **Primary:** Argentine consumers aged 18-45 purchasing clothing online
- **Secondary:** Brand administrators managing products, orders, and inventory

### 1.3 Key Differentiators
- Native Mercado Pago integration (Argentina's dominant payment processor)
- "Cuotas sin interés" (interest-free installments) support
- Localized shipping with AMBA, Interior, and pickup options
- Self-hosted on Hetzner for data sovereignty and cost control
- Built with modern stack (TanStack, React 19, TypeScript)

---

## 2. Goals & Success Metrics

### 2.1 Business Goals
| Goal | Target | Timeline |
|------|--------|----------|
| Launch MVP | Fully functional store | Q1 2025 |
| Monthly Active Users | 5,000 | 6 months post-launch |
| Conversion Rate | 2.5%+ | 6 months post-launch |
| Average Order Value | $45,000 ARS | Ongoing |
| Cart Abandonment Rate | <70% | 6 months post-launch |

### 2.2 Technical Goals
- Page load time < 2 seconds
- 99.5% uptime
- Mobile-first responsive design
- SEO-optimized for Argentine market

---

## 3. User Personas

### 3.1 Buyer Persona: "Lucía"
- **Age:** 28
- **Location:** CABA (Buenos Aires)
- **Behavior:** 
  - Shops primarily on mobile
  - Compares prices across multiple sites
  - Values "cuotas sin interés"
  - Expects free shipping over certain amount
- **Pain Points:**
  - Distrusts sites without Mercado Pago
  - Frustrated by hidden shipping costs
  - Wants to know delivery time upfront

### 3.2 Buyer Persona: "Martín"
- **Age:** 35
- **Location:** Córdoba (Interior)
- **Behavior:**
  - Shops on desktop during work breaks
  - Reads product reviews carefully
  - Prefers bank transfer for larger purchases
- **Pain Points:**
  - Interior shipping takes too long
  - Limited size availability
  - Unclear return policies

### 3.3 Admin Persona: "Brand Owner"
- **Needs:**
  - Easy product/inventory management
  - Real-time order notifications
  - Sales analytics dashboard
  - Bulk product upload via CSV

---

## 4. Features & Requirements

### 4.1 MVP Features (Phase 1)

#### 4.1.1 Storefront
| Feature | Priority | Status |
|---------|----------|--------|
| Homepage with hero, featured products, categories | P0 | ✅ Done |
| Product listing with filters (category, price, size) | P0 | ✅ Done |
| Product detail page with images, sizes, add to cart | P0 | ✅ Done |
| Category pages | P0 | ✅ Done |
| Search functionality | P0 | ✅ Done |
| Mobile-responsive design | P0 | ✅ Done |

#### 4.1.2 Shopping Cart
| Feature | Priority | Status |
|---------|----------|--------|
| Add/remove items | P0 | ✅ Done |
| Update quantities | P0 | ✅ Done |
| Persistent cart (localStorage) | P0 | ✅ Done |
| Mini-cart sidebar | P1 | ✅ Done |
| Cart page with summary | P0 | ✅ Done |

#### 4.1.3 Checkout
| Feature | Priority | Status |
|---------|----------|--------|
| Guest checkout | P1 | 🔲 Pending |
| Authenticated checkout | P0 | ✅ Done |
| Shipping address form | P0 | ✅ Done |
| Shipping zone selection (AMBA/Interior/Pickup) | P0 | 🔲 Pending |
| Shipping cost calculation | P0 | 🔲 Pending |
| Mercado Pago integration | P0 | 🔲 Pending |
| Bank transfer option | P1 | 🔲 Pending |
| Order confirmation page | P0 | 🔲 Pending |

#### 4.1.4 User Accounts
| Feature | Priority | Status |
|---------|----------|--------|
| Email/password registration | P0 | ✅ Done |
| Social login (Google, GitHub) | P2 | ✅ Done |
| Account dashboard | P0 | ✅ Done |
| Order history | P0 | ✅ Done |
| Order detail with tracking | P0 | ✅ Done |
| Saved addresses | P1 | ✅ Done |
| Wishlist | P2 | ✅ Done |

#### 4.1.5 Database Schema
| Feature | Priority | Status |
|---------|----------|--------|
| Products & variants | P0 | ✅ Done |
| Categories (hierarchical) | P0 | ✅ Done |
| Orders & order items | P0 | ✅ Done |
| User addresses | P0 | ✅ Done |
| Cart persistence (DB) | P1 | ✅ Done |
| Reviews & ratings | P2 | ✅ Done |
| Coupons/discounts | P2 | ✅ Done |
| Wishlist | P2 | ✅ Done |

### 4.2 Phase 2 Features

#### 4.2.1 Admin Panel
| Feature | Priority |
|---------|----------|
| Product CRUD with image upload | P0 |
| Inventory management | P0 |
| Order management & status updates | P0 |
| Customer list | P1 |
| Coupon management | P2 |
| Sales dashboard & analytics | P1 |
| CSV product import/export | P2 |

#### 4.2.2 Enhanced Storefront
| Feature | Priority |
|---------|----------|
| Product reviews & ratings display | P1 |
| Size guide | P1 |
| Recently viewed products | P2 |
| "Complete the look" recommendations | P2 |
| Stock alerts ("Últimas unidades") | P1 |
| Sale/discount badges | P1 |

#### 4.2.3 Marketing & SEO
| Feature | Priority |
|---------|----------|
| SEO meta tags per page | P0 |
| Sitemap generation | P1 |
| Newsletter signup | P2 |
| WhatsApp integration | P1 |
| Instagram shop sync | P3 |

### 4.3 Phase 3 Features

| Feature | Priority |
|---------|----------|
| Multi-currency support (USD for wholesale) | P3 |
| Wholesale/B2B portal | P3 |
| Loyalty points program | P3 |
| Gift cards | P3 |
| Advanced analytics (Umami) | P2 |
| A/B testing | P3 |

---

## 5. Technical Architecture

### 5.1 Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, TanStack Router/Start/Query |
| Styling | Tailwind CSS, shadcn/ui |
| State Management | Zustand |
| Backend | TanStack Start (SSR), Node.js |
| Database | PostgreSQL 16 (Docker) |
| ORM | Drizzle ORM |
| Authentication | Better Auth |
| Payments | Mercado Pago SDK |
| File Storage | Cloudflare R2 |
| Hosting | Hetzner VPS |
| Reverse Proxy | Caddy |
| Monitoring | Uptime Kuma, Dozzle |
| Analytics | Umami |

### 5.2 Infrastructure
```
┌─────────────────────────────────────────────────────┐
│                    Cloudflare                        │
│            (DNS, CDN, DDoS Protection)              │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│                  Hetzner VPS                         │
│  ┌─────────────────────────────────────────────┐    │
│  │              Docker Compose                  │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │    │
│  │  │  Caddy  │  │   App   │  │  PostgreSQL │  │    │
│  │  │ :80/443 │──│  :3000  │──│    :5432    │  │    │
│  │  └─────────┘  └─────────┘  └─────────────┘  │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │    │
│  │  │ Umami   │  │ Uptime  │  │   Dozzle    │  │    │
│  │  │  :3001  │  │  Kuma   │  │   :8080     │  │    │
│  │  └─────────┘  └─────────┘  └─────────────┘  │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 5.3 Database Schema Overview
- **15 tables** covering products, categories, orders, users, cart, reviews, coupons, wishlist
- See `docs/2-ecommerce-schema.md` for full documentation

---

## 6. Argentina-Specific Requirements

### 6.1 Payments
| Requirement | Implementation |
|-------------|----------------|
| Mercado Pago | Primary payment gateway |
| Cuotas sin interés | 3, 6, 12 installment display |
| Bank transfer | Manual confirmation flow |
| Cash on delivery | AMBA only |
| Invoice (Factura) | Integration with AFIP (Phase 2) |

### 6.2 Shipping
| Zone | Estimated Delivery | Cost Logic |
|------|-------------------|------------|
| AMBA | 1-3 business days | Weight-based, free over $50,000 |
| Interior | 5-10 business days | Zone + weight based |
| Pickup | Same day | Free |

### 6.3 Legal Compliance
- "Botón de arrepentimiento" (regret button) - 10-day return policy display
- Consumer protection law compliance
- Privacy policy in Spanish
- Clear pricing in ARS (no hidden fees)

### 6.4 Localization
- All UI text in Spanish (Argentina)
- Date format: DD/MM/YYYY
- Currency: $ (ARS) with thousands separator: $45.990
- Phone format: +54 XX XXXX-XXXX
- Address format: Argentine postal codes

---

## 7. User Flows

### 7.1 Purchase Flow
```
Homepage → Browse/Search → Product Detail → Add to Cart 
    → Cart Review → Checkout (Login/Guest) → Shipping 
    → Payment (Mercado Pago) → Confirmation → Email
```

### 7.2 Account Flow
```
Register/Login → Dashboard → View Orders → Order Detail 
    → Track Shipment
    
Dashboard → Addresses → Add/Edit/Delete
Dashboard → Wishlist → Add to Cart
```

### 7.3 Admin Flow (Phase 2)
```
Login → Dashboard → Products → Add/Edit/Delete
Dashboard → Orders → View/Update Status → Notify Customer
Dashboard → Analytics → Sales Reports
```

---

## 8. Non-Functional Requirements

### 8.1 Performance
| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| Core Web Vitals | Pass |

### 8.2 Security
- HTTPS everywhere (Caddy auto-SSL)
- CSRF protection (Better Auth)
- Rate limiting on auth endpoints
- Input sanitization
- SQL injection prevention (Drizzle ORM)
- XSS prevention (React)
- Secure session management

### 8.3 Scalability
- Horizontal scaling via Docker replicas
- Database connection pooling
- CDN for static assets (Cloudflare)
- Image optimization (R2 + transformations)

### 8.4 Reliability
- 99.5% uptime target
- Automated backups (daily)
- Health checks (Uptime Kuma)
- Error logging and alerting

---

## 9. API Endpoints (Phase 1)

### 9.1 Products
```
GET    /api/products              # List with filters
GET    /api/products/:slug        # Single product
GET    /api/products/featured     # Featured products
```

### 9.2 Categories
```
GET    /api/categories            # Category tree
GET    /api/categories/:slug      # Category with products
```

### 9.3 Cart (Authenticated)
```
GET    /api/cart                  # Get user cart
POST   /api/cart/items            # Add item
PATCH  /api/cart/items/:id        # Update quantity
DELETE /api/cart/items/:id        # Remove item
```

### 9.4 Orders
```
POST   /api/orders                # Create order
GET    /api/account/orders        # User orders
GET    /api/account/orders/:id    # Order detail
```

### 9.5 Checkout
```
POST   /api/checkout/shipping     # Calculate shipping
POST   /api/checkout/payment      # Init Mercado Pago
POST   /api/webhooks/mercadopago  # Payment webhook
```

### 9.6 Account
```
GET    /api/account/addresses     # List addresses
POST   /api/account/addresses     # Add address
PATCH  /api/account/addresses/:id # Update address
DELETE /api/account/addresses/:id # Delete address
GET    /api/account/wishlist      # Get wishlist
POST   /api/account/wishlist      # Add to wishlist
DELETE /api/account/wishlist/:id  # Remove from wishlist
```

---

## 10. Milestones & Timeline

### Phase 1: MVP (8 weeks)
| Week | Focus |
|------|-------|
| 1-2 | ✅ Database schema, authentication |
| 3-4 | ✅ Frontend structure, cart (Zustand) |
| 5-6 | 🔲 API endpoints, product CRUD |
| 7-8 | 🔲 Mercado Pago integration, checkout flow |

### Phase 2: Admin & Polish (6 weeks)
| Week | Focus |
|------|-------|
| 9-10 | Admin panel (products, orders) |
| 11-12 | Reviews, size guides, stock alerts |
| 13-14 | SEO, performance optimization |

### Phase 3: Growth (Ongoing)
- Marketing integrations
- Analytics refinement
- Feature iterations based on user feedback

---

## 11. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Mercado Pago API changes | High | Low | Pin SDK version, monitor changelog |
| High shipping costs | Medium | Medium | Negotiate with carriers, offer pickup |
| Cart abandonment | High | High | Email recovery, WhatsApp support |
| Inventory sync issues | Medium | Medium | Real-time stock updates, oversell protection |
| Server downtime | High | Low | Uptime monitoring, automated restarts |

---

## 12. Open Questions

1. **Brand identity:** Logo, color scheme, typography finalized?
2. **Product catalog:** How many SKUs at launch? Size/color variants?
3. **Photography:** Product images ready? Lifestyle shots needed?
4. **Shipping partners:** OCA, Andreani, or custom logistics?
5. **Returns policy:** Who pays return shipping?
6. **Launch marketing:** Soft launch or public campaign?

---

## 13. Appendix

### 13.1 Related Documents
- `docs/0-architecture.md` - Technical architecture
- `docs/1-arg-ecom-deploy.md` - Argentina deployment guide
- `docs/2-ecommerce-schema.md` - Database schema
- `docs/3-frontend-structure.md` - Frontend components

### 13.2 Competitors Reference
- Dafiti Argentina
- Mercado Libre
- Falabella Argentina
- Local Instagram clothing brands

### 13.3 Design Resources
- Tailwind UI components
- shadcn/ui primitives
- Argentine e-commerce UX patterns
