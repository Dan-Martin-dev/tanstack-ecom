# E-Commerce Stack for Argentina (Free/Open Source Focus)

## Payment Solutions for Argentina 🇦🇷

| Provider            | Pros                                                                                 | Cons                         |
| ------------------- | ------------------------------------------------------------------------------------ | ---------------------------- |
| **Mercado Pago** ✅ | Local leader, handles ARS, installments (cuotas), cash payments (Rapipago/PagoFácil) | 4.5% + IVA fee               |
| **Mobbex**          | Lower fees, good API                                                                 | Less known                   |
| **Stripe**          | International cards only                                                             | Doesn't support ARS directly |

**Recommendation**: Use **Mercado Pago** as primary (for local customers) + optional Stripe for USD international sales.

---

## Updated Tech Stack (Free/Open Source)

| Need                | Solution                                                   | Cost                       |
| ------------------- | ---------------------------------------------------------- | -------------------------- |
| **Payments**        | Mercado Pago SDK                                           | Free (pay per transaction) |
| **Image Storage**   | Cloudflare R2                                              | Free 10GB/mo               |
| **Email**           | **Resend** (100/day free) or **Mailpit** (self-hosted dev) | Free                       |
| **Search**          | PostgreSQL Full-Text Search                                | Free (built-in)            |
| **Background Jobs** | **BullMQ** + Redis or **pg-boss** (PostgreSQL-only)        | Free                       |
| **Caching**         | **Drizzle query caching** or Redis                         | Free                       |
| **Monitoring**      | **Uptime Kuma** (self-hosted)                              | Free                       |
| **Analytics**       | **Umami** or **Plausible** (self-hosted)                   | Free                       |
| **Logs**            | **Dozzle** (Docker logs viewer)                            | Free                       |

---

## Architecture for Argentina

```
┌─────────────────────────────────────────────────────────┐
│                    CLOUDFLARE (Free)                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │   CDN   │  │   DNS   │  │   R2    │                 │
│  └────┬────┘  └────┬────┘  └─────────┘                 │
└───────┼────────────┼────────────────────────────────────┘
        │            │
        ▼            ▼
┌───────────────────────────────────────────────────────┐
│                  HETZNER VPS (€4.50/mo)               │
│                                                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Caddy (reverse proxy + auto HTTPS)             │  │
│  └─────────────────────┬───────────────────────────┘  │
│                        │                              │
│  ┌────────┬────────────┼────────────┬──────────┐     │
│  │        │            │            │          │     │
│  ▼        ▼            ▼            ▼          ▼     │
│ ┌────┐ ┌──────┐ ┌───────────┐ ┌────────┐ ┌───────┐  │
│ │App │ │Postgres│ │Uptime Kuma│ │ Umami  │ │Dozzle │  │
│ └────┘ └──────┘ └───────────┘ └────────┘ └───────┘  │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## Packages to Add

```bash
# Mercado Pago (Argentina payments)
pnpm add mercadopago

# Image uploads to R2 (S3-compatible)
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# Email (free tier)
pnpm add resend

# Background jobs (PostgreSQL-only, no Redis needed)
pnpm add pg-boss

# Optional: Generate invoices (AFIP compliance)
pnpm add pdfkit
```

---

## Argentina-Specific Considerations

### 1. **Currency & Pricing**

```typescript
// Store prices in centavos (integer) to avoid floating point issues
// 1500000 = $15,000 ARS
price: (integer("price").notNull(),
  // Display with Intl
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price / 100));
```

### 2. **Shipping Zones**

- **AMBA** (Buenos Aires metro)
- **Interior** (rest of country)
- Consider **Andreani**, **OCA**, **Correo Argentino** APIs

### 3. **Tax (IVA)**

- Most products: **21% IVA**
- Some categories: 10.5% or exempt
- Store prices with IVA included (consumer-facing)

### 4. **Facturación Electrónica (AFIP)**

For legal invoicing, you'll eventually need:

- **AFIP Web Services** integration (complex)
- Or use **Facturante**, **Colppy**, **TusFacturas** APIs

---

## Docker Compose for Self-Hosting

```yaml
# docker-compose.prod.yml
services:
  app:
    build: .
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/ecom
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ecom
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}

  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data

  # Monitoring (optional)
  uptime-kuma:
    image: louislam/uptime-kuma:1
    restart: unless-stopped
    volumes:
      - uptime_data:/app/data

  # Analytics (optional)
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/umami
    depends_on:
      - db

  # Log viewer (optional)
  dozzle:
    image: amir20/dozzle:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  postgres_data:
  caddy_data:
  uptime_data:
```

---

## Monthly Cost Estimate (Argentina-Optimized)

| Service               | Cost                       |
| --------------------- | -------------------------- |
| Hetzner CX21          | €4.50/mo (~$5 USD)         |
| Cloudflare Free       | $0                         |
| Cloudflare R2 (10GB)  | $0                         |
| Resend (3K emails/mo) | $0                         |
| Domain (.com.ar)      | ~$2,000 ARS/year at NIC.ar |
| **Mercado Pago**      | 4.5% + IVA per sale        |
| **Total Fixed**       | **~$5 USD/mo**             |

---

## Open Source Alternatives Summary

| Commercial       | Open Source Alternative     |
| ---------------- | --------------------------- |
| Vercel           | Self-hosted on Hetzner      |
| Supabase         | PostgreSQL + Drizzle        |
| Clerk/Auth0      | Better Auth (you have it!)  |
| Algolia          | PostgreSQL full-text search |
| SendGrid         | Resend free tier            |
| Datadog          | Uptime Kuma + Dozzle        |
| Google Analytics | Umami (self-hosted)         |
| AWS S3           | Cloudflare R2               |

---

## Next Steps

1. **Create the e-commerce database schema** (products, orders, cart with ARS prices)
2. **Set up Mercado Pago integration** (checkout, webhooks, cuotas)
3. **Create the `docker-compose.prod.yml`** with all services
4. **Set up Cloudflare R2** for product images
5. **Add PostgreSQL full-text search** for products</content>
   <parameter name="filePath">/home/vare/project/ecom_202/tanstack-ecom/docs/argentina-deployment.md
