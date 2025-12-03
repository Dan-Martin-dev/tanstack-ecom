# TanStack E-commerce Application Makefile
# Convenient shortcuts for development workflow

.PHONY: help dev build preview start lint format check-types check db-up db-down db-push db-studio db-generate db-reset deps deps-major ui auth-secret auth-generate git-commit clean install setup

# Default target
help: ## Show this help message
	@echo "TanStack E-commerce Application - Development Shortcuts"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Development:"
	@echo "  dev          Start development server"
	@echo "  build        Build for production"
	@echo "  preview      Preview production build"
	@echo "  start        Start production server"
	@echo ""
	@echo "Database (Drizzle ORM):"
	@echo "  db-up        Start PostgreSQL database"
	@echo "  db-down      Stop PostgreSQL database"
	@echo "  db-push      Push schema directly (dev only)"
	@echo "  db-generate  Generate migration SQL files"
	@echo "  db-migrate   Apply pending migrations"
	@echo "  db-studio    Open visual database browser"
	@echo "  db-check     Check for schema drift"
	@echo "  db-reset     Reset database (DESTROYS DATA)"
	@echo ""
	@echo "Database Queries (E-Commerce):"
	@echo "  db-connect   Interactive psql shell"
	@echo "  db-tables    List all tables"
	@echo "  db-products  Show products with prices"
	@echo "  db-categories Show categories"
	@echo "  db-orders    Show recent orders"
	@echo "  db-carts     Show active carts"
	@echo "  db-reviews   Show recent reviews"
	@echo "  db-coupons   Show all coupons"
	@echo "  db-low-stock Show low stock products"
	@echo "  db-stats     Show table row counts"
	@echo "  db-size      Show database size"
	@echo ""
	@echo "Database Queries (Auth):"
	@echo "  db-users     Show all users"
	@echo "  db-sessions  Show all sessions"
	@echo "  db-accounts  Show all OAuth accounts"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint         Run ESLint"
	@echo "  format       Format code with Prettier"
	@echo "  check-types  Run TypeScript type checking"
	@echo "  check        Run all code quality checks"
	@echo ""
	@echo "Authentication:"
	@echo "  auth-secret  Generate Better Auth secret"
	@echo "  auth-generate Regenerate auth database schema"
	@echo ""
	@echo "Dependencies:"
	@echo "  deps         Update dependencies (patch/minor)"
	@echo "  deps-major   Update dependencies (major versions)"
	@echo "  ui           Add shadcn/ui component"
	@echo ""
	@echo "Git:"
	@echo "  git-commit   Automated git workflow"
	@echo ""
	@echo "Project Setup:"
	@echo "  install      Install dependencies"
	@echo "  setup        Complete project setup (install + db + dev)"
	@echo "  clean        Clean build artifacts"
	@echo ""




# Development Commands
dev: ## Start development server
	pnpm dev

build: ## Build for production
	pnpm build

preview: ## Preview production build
	pnpm preview

start: ## Start production server
	pnpm start





# =============================================================================
# DATABASE COMMANDS (Drizzle ORM)
# =============================================================================
# Drizzle is your TypeScript ORM for PostgreSQL. These commands manage your
# database schema and migrations.
#
# Workflow:
#   1. Edit schema in src/lib/db/schema/*.ts
#   2. Run 'make db-generate' to create migration files
#   3. Run 'make db-push' to apply changes to database
#   4. Use 'make db-studio' to visually browse your data
# =============================================================================

up: ## Start all Docker services (db, caddy, monitoring)
	docker-compose up -d

db-up: ## Start PostgreSQL database container only
	docker compose up db -d

db-down: ## Stop all Docker services
	docker-compose down

db-push: ## Push schema directly to database (dev only, no migration files)
	# Use this for quick prototyping - applies schema changes immediately
	# WARNING: May cause data loss if columns are removed
	pnpm drizzle-kit push

db-studio: ## Open Drizzle Studio - visual database browser at https://local.drizzle.studio
	# Opens a web UI to browse, edit, and query your database
	pnpm drizzle-kit studio

db-generate: ## Generate SQL migration files from schema changes
	# Creates timestamped SQL files in ./drizzle/ folder
	# Review these files before applying to production!
	pnpm drizzle-kit generate

db-migrate: ## Apply pending migrations to database
	# Runs all unapplied migrations from ./drizzle/ folder
	# Safe for production - tracks which migrations have been applied
	pnpm drizzle-kit migrate

db-reset: ## Reset database and reapply all migrations (DESTROYS ALL DATA)
	# WARNING: This deletes all data! Only use in development
	pnpm drizzle-kit push --force

db-check: ## Check for schema drift between code and database
	# Compares your schema files with the actual database state
	pnpm drizzle-kit check

db-drop: ## Drop all tables (DANGEROUS - development only)
	# WARNING: This deletes everything! Use with caution
	pnpm drizzle-kit drop


# =============================================================================
# DATABASE QUERY COMMANDS (Docker PostgreSQL)
# =============================================================================
# Quick commands to inspect your database data using psql inside Docker.
# These connect to the PostgreSQL container, not local psql.
# Credentials are read from .env file (POSTGRES_USER, POSTGRES_DB)
# =============================================================================

# Load .env file
include .env
export

# Docker psql command - runs psql inside the db container
DOCKER_PSQL = docker exec -it tanstack-ecom-db-1 psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

db-connect: ## Connect to database with interactive psql shell
	$(DOCKER_PSQL)

db-tables: ## List all tables in the database
	$(DOCKER_PSQL) -c "\dt"

db-describe: ## Describe a table structure (usage: make db-describe TABLE=product)
	$(DOCKER_PSQL) -c "\d $(TABLE)"


# -----------------------------------------------------------------------------
# Auth Tables
# -----------------------------------------------------------------------------

db-users: ## Show all users
	$(DOCKER_PSQL) -c "SELECT id, name, email, email_verified, created_at FROM \"user\" ORDER BY created_at DESC;"

db-sessions: ## Show recent sessions
	$(DOCKER_PSQL) -c "SELECT id, user_id, expires_at, created_at FROM session ORDER BY created_at DESC LIMIT 10;"

db-accounts: ## Show all OAuth accounts (GitHub, Google logins)
	$(DOCKER_PSQL) -c "SELECT id, provider_id, user_id, created_at FROM account ORDER BY created_at DESC;"


# -----------------------------------------------------------------------------
# E-Commerce Tables
# -----------------------------------------------------------------------------

db-products: ## Show all products with prices (in ARS)
	$(DOCKER_PSQL) -c "SELECT id, name, price/100 as price_ars, stock, is_active FROM product ORDER BY created_at DESC LIMIT 20;"

db-categories: ## Show all categories
	$(DOCKER_PSQL) -c "SELECT id, name, slug, parent_id, is_active FROM category ORDER BY sort_order;"

db-orders: ## Show recent orders with status
	$(DOCKER_PSQL) -c "SELECT order_number, status, total/100 as total_ars, payment_method, created_at FROM \"order\" ORDER BY created_at DESC LIMIT 20;"

db-carts: ## Show active carts
	$(DOCKER_PSQL) -c "SELECT c.id, c.user_id, COUNT(ci.id) as items, c.expires_at FROM cart c LEFT JOIN cart_item ci ON c.id = ci.cart_id GROUP BY c.id ORDER BY c.updated_at DESC LIMIT 10;"

db-reviews: ## Show recent reviews
	$(DOCKER_PSQL) -c "SELECT r.rating, r.title, p.name as product, u.name as reviewer, r.is_approved FROM review r JOIN product p ON r.product_id = p.id JOIN \"user\" u ON r.user_id = u.id ORDER BY r.created_at DESC LIMIT 10;"

db-coupons: ## Show all coupons
	$(DOCKER_PSQL) -c "SELECT code, discount_type, discount_value, used_count, usage_limit, is_active, expires_at FROM coupon ORDER BY created_at DESC;"

db-low-stock: ## Show products with low stock
	$(DOCKER_PSQL) -c "SELECT name, sku, stock, low_stock_threshold FROM product WHERE stock <= low_stock_threshold AND is_active = true ORDER BY stock;;"


# -----------------------------------------------------------------------------
# Database Stats
# -----------------------------------------------------------------------------

db-stats: ## Show table row counts
	$(DOCKER_PSQL) -c "SELECT schemaname, relname as table, n_live_tup as row_count FROM pg_stat_user_tables ORDER BY n_live_tup DESC;"

db-size: ## Show database size
	$(DOCKER_PSQL) -c "SELECT pg_size_pretty(pg_database_size('tanstack-ecom')) as database_size;"




# Code Quality Commands
lint: ## Run ESLint
	pnpm lint

format: ## Format code with Prettier
	pnpm format

check-types: ## Run TypeScript type checking
	pnpm check-types

check: ## Run all code quality checks
	pnpm check





# Authentication Commands
auth-secret: ## Generate Better Auth secret
	pnpm auth:secret

auth-generate: ## Regenerate auth database schema
	pnpm auth:generate





# Dependency Commands
deps: ## Update dependencies (patch/minor)
	pnpm deps

deps-major: ## Update dependencies (major versions)
	pnpm deps:major

ui: ## Add shadcn/ui component
	pnpm ui




# Git Commands
commit: ## Automated git workflow
	pnpm git:commit




# Project Setup Commands
install: ## Install dependencies
	pnpm install

setup: install db-up db-push ## Complete project setup (install + db + dev)
	@echo "🚀 Setup complete! Run 'make dev' to start development server"

clean: ## Clean build artifacts
	rm -rf .output node_modules/.vite dist




# Combined Commands for Common Workflows
dev-full: db-up dev ## Start database and development server

build-deploy: check build ## Run checks and build for deployment

db-setup: db-up db-push ## Setup database (start + push schema)

code-check: format lint check-types ## Run all code quality tools




# Development Workflow Shortcuts
new-feature: ## Start new feature (format + dev)
	@echo "🎯 Starting new feature development..."
	make format
	make dev

pre-commit: ## Pre-commit checks (format + lint + types)
	@echo "🔍 Running pre-commit checks..."
	make format
	make lint
	make check-types

deploy-prep: ## Prepare for deployment (check + build)
	@echo "📦 Preparing for deployment..."
	make check
	make build

# Database Development Workflow
db-dev: db-reset db-push ## Reset and setup database for development
	@echo "🗄️ Database reset and schema pushed"

# Emergency Commands
stop-all: ## Stop all running processes
	@echo "🛑 Stopping all processes..."
	-pkill -f "vite"
	-pkill -f "node.*\.output"
	-docker-compose down
	@echo "✅ All processes stopped"

# Info Commands
info: ## Show project information
	@echo "📊 Project Information:"
	@echo "Node version: $$(node --version)"
	@echo "PNPM version: $$(pnpm --version)"
	@echo "Database: PostgreSQL (Docker)"
	@echo "Framework: TanStack Start + React 19"
	@echo "Styling: Tailwind CSS + shadcn/ui"

status: ## Show current status
	@echo "📈 Current Status:"
	@echo "Database: $$(docker-compose ps --services --filter "status=running" | wc -l) services running"
	@echo "Node processes: $$(pgrep -f "node\|vite" | wc -l) running"
	@echo "Git branch: $$(git branch --show-current)"
	@echo "Last commit: $$(git log -1 --oneline)"