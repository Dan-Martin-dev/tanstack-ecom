# TanStack E-commerce Application Architecture

## Overview

This is a modern full-stack e-commerce application built with **TanStack Start**, featuring a complete authentication system, database integration, and a scalable React architecture. The application serves as a foundation for building e-commerce platforms with user management, product catalogs, and secure transactions.

## 🏗️ Tech Stack

### Frontend Framework
- **React 19** - Latest React with concurrent features and React Compiler
- **TanStack Router** - Type-safe routing with file-based routing
- **TanStack Query** - Powerful data fetching and caching
- **TanStack Start** - Full-stack React framework with SSR support

### Build Tools & Development
- **Vite with Rolldown** - Fast build tool and experimental bundler
- **TypeScript** - Type-safe JavaScript with strict configuration
- **ESLint + Prettier** - Code linting and formatting
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI

### Backend & Database
- **Better Auth** - Complete authentication solution with social providers
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Robust relational database
- **Docker Compose** - Containerized database setup

### Development Tools
- **pnpm** - Fast package manager
- **Drizzle Kit** - Database migration and schema management
- **Nitro v3** - Server-side rendering and API routes

## 📁 Project Structure

```
tanstack-ecom/
├── docs/                    # Documentation
├── public/                  # Static assets
├── scripts/                 # Build and utility scripts
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   └── *-button.tsx    # Auth and theme components
│   ├── env/                # Environment variable validation
│   ├── lib/
│   │   ├── auth/           # Authentication logic
│   │   ├── db/             # Database connection and schemas
│   │   └── utils.ts        # Utility functions
│   ├── routes/             # File-based routing
│   │   ├── (auth-pages)/   # Public auth routes
│   │   ├── (authenticated)/ # Protected routes
│   │   └── api/            # API routes
│   ├── router.tsx          # Main router configuration
│   └── styles.css          # Global styles
├── docker-compose.yml       # Database container
├── drizzle.config.ts        # Database configuration
├── package.json             # Dependencies and scripts
└── vite.config.ts           # Build configuration
```

## 🔧 Core Architecture

### 1. Routing System (TanStack Router)

The application uses **file-based routing** where routes are defined by the file structure in `src/routes/`:

```typescript
// src/routes/__root.tsx - Root layout
// src/routes/index.tsx - Home page
// src/routes/(auth-pages)/login.tsx - Login page
// src/routes/(authenticated)/dashboard/index.tsx - Dashboard
```

**Route Groups:**
- `(auth-pages)` - Public routes for login/signup
- `(authenticated)` - Protected routes requiring authentication

### 2. Authentication Flow (Better Auth)

**Configuration** (`src/lib/auth/auth.ts`):
- Social providers (GitHub, Google)
- Email/password authentication
- Session management with cookie caching
- Database adapter for Drizzle ORM

**Client Integration** (`src/lib/auth/auth-client.ts`):
- React hooks for auth state
- Sign in/out functions
- Session management

**Server Functions** (`src/lib/auth/functions.ts`):
- Server-side user fetching
- Session validation
- Cookie forwarding

### 3. Database Layer (Drizzle ORM)

**Schema Definition** (`src/lib/db/schema/`):
- Auth tables (users, sessions, accounts)
- Custom business tables (products, orders, etc.)

**Database Connection** (`src/lib/db/index.ts`):
- PostgreSQL connection with environment variables
- Query builder and migration support

**Configuration** (`drizzle.config.ts`):
- Migration settings
- Database URL configuration

### 4. Environment Management

**Server Environment** (`src/env/server.ts`):
- Database credentials
- Auth secrets
- OAuth provider keys

**Client Environment** (`src/env/client.ts`):
- Public URLs and configuration
- Client-side accessible variables

### 5. Component Architecture

**UI Components** (`src/components/ui/`):
- shadcn/ui primitives (Button, Input, etc.)
- Consistent design system

**Feature Components** (`src/components/`):
- Auth buttons and forms
- Theme provider and toggle
- Error boundaries

## 🚀 Development Workflow

### 1. Local Development

```bash
# Install dependencies
pnpm install

# Start PostgreSQL database
docker-compose up -d

# Push database schema
pnpm db push

# Start development server
pnpm dev
```

### 2. Database Operations

```bash
# Generate migrations
pnpm db generate

# Push schema changes
pnpm db push

# Open Drizzle Studio
pnpm db studio

# Reset database (development only)
pnpm db reset
```

### 3. Authentication Setup

```bash
# Generate auth secret
pnpm auth:secret

# Regenerate auth schema after config changes
pnpm auth:generate
```

### 4. Code Quality

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Type checking
pnpm check-types

# Run all checks
pnpm check
```

## 🔐 Authentication System

### How It Works

1. **Client-Side**: User interacts with login/signup forms
2. **Better Auth**: Handles authentication logic and session creation
3. **Database**: Stores user data, sessions, and OAuth accounts
4. **Middleware**: Protects routes and validates sessions
5. **Server Functions**: Fetch user data securely

### Social Authentication Flow

```
User clicks "Sign in with GitHub"
    ↓
Better Auth redirects to GitHub
    ↓
GitHub OAuth callback
    ↓
Better Auth creates/updates user record
    ↓
Session cookie set
    ↓
User redirected to dashboard
```

### Session Management

- **Cookie-based sessions** with automatic refresh
- **5-minute cache** for performance
- **Server-side validation** on protected routes
- **Automatic logout** on session expiry

## 🗄️ Database Design

### Core Tables

**Auth Schema** (generated by Better Auth):
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth provider links
- `verification` - Email verification tokens

**Business Schema** (custom):
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items

### Migration Strategy

1. **Development**: Direct schema pushes with `pnpm db push`
2. **Production**: Generated migrations with `pnpm db generate`
3. **Schema Updates**: Use Drizzle Kit for safe migrations

## 🎨 UI/UX Architecture

### Design System

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent components
- **Radix UI** primitives for accessibility
- **Lucide React** for icons

### Theme Support

- **Light/Dark mode** toggle
- **System preference** detection
- **Persistent theme** storage
- **CSS variables** for dynamic theming

### Responsive Design

- **Mobile-first** approach
- **Breakpoint system** with Tailwind
- **Accessible components** with Radix UI

## 🔧 Build & Deployment

### Development Build

```bash
pnpm build  # Creates .output/ directory
pnpm preview # Preview production build
```

### Production Deployment

The app is configured for **Nitro v3** deployment:

- **Vercel**: Default configuration
- **Other platforms**: Update `vite.config.ts`
- **Static hosting**: Use `pnpm build` output

### Environment Variables

**Required for production:**
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth encryption key
- `VITE_BASE_URL` - Application base URL

## 🛠️ Custom Scripts

### Git Automation (`scripts/git-commit.js`)

Automates git workflow with task categorization:

```bash
pnpm git:commit -t feature -m "Add shopping cart"
# Creates commit: [FEATURE] Add shopping cart
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Production build
- `pnpm db <command>` - Database operations
- `pnpm auth:generate` - Update auth schema
- `pnpm ui add <component>` - Add shadcn/ui components
- `pnpm git:commit` - Automated git workflow

### Makefile Shortcuts

For convenience, a [Makefile](./Makefile) provides shortcuts for common development tasks:

```bash
# Quick development setup
make setup        # Complete project setup (install + db + dev)
make dev-full     # Start database + development server

# Database operations
make db-up        # Start PostgreSQL
make db-push      # Push schema changes
make db-studio    # Open database GUI

# Code quality
make check        # Run all checks (format, lint, types)
make format       # Format code
make pre-commit   # Pre-commit checks

# Combined workflows
make deploy-prep  # Prepare for deployment
make status       # Show project status
```

Run `make help` to see all available shortcuts.

## 🔍 Key Features

### Performance Optimizations

- **Server-Side Rendering** with TanStack Start
- **Query caching** with TanStack Query
- **Code splitting** with Vite
- **Image optimization** (planned)
- **Database indexing** for fast queries

### Security Features

- **CSRF protection** via Better Auth
- **SQL injection prevention** with Drizzle ORM
- **XSS protection** with React
- **Secure cookies** for sessions
- **Environment variable validation**

### Developer Experience

- **Hot reload** during development
- **Type safety** with TypeScript
- **Auto-formatting** with Prettier
- **Linting** with ESLint
- **Database GUI** with Drizzle Studio

## 🚀 Scaling Considerations

### Database Scaling

- **Connection pooling** with PostgreSQL
- **Read replicas** for high traffic
- **Database indexing** strategy
- **Query optimization** with Drizzle

### Application Scaling

- **Microservices** architecture ready
- **API rate limiting** (planned)
- **Caching layers** (Redis planned)
- **CDN integration** for assets

### Monitoring & Analytics

- **Error tracking** (planned)
- **Performance monitoring** (planned)
- **User analytics** (planned)
- **Database monitoring** (planned)

## 📚 Learning Resources

- [TanStack Start Docs](https://tanstack.com/start)
- [Better Auth Documentation](https://www.better-auth.com)
- [Drizzle ORM Guide](https://orm.drizzle.team)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contributing

1. Follow the established code style
2. Use the git commit script for consistent messages
3. Run `pnpm check` before committing
4. Test database changes locally
5. Update documentation for new features

---

This architecture provides a solid foundation for building scalable e-commerce applications with modern React patterns, type safety, and excellent developer experience.