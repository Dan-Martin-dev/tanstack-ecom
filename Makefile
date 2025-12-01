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
	@echo "Database:"
	@echo "  db-up        Start PostgreSQL database"
	@echo "  db-down      Stop PostgreSQL database"
	@echo "  db-push      Push schema to database"
	@echo "  db-studio    Open Drizzle Studio"
	@echo "  db-generate  Generate migrations"
	@echo "  db-reset     Reset database (development only)"
	@echo ""
	@echo "Database Queries:"
	@echo "  db-connect   Connect to database with psql"
	@echo "  db-tables    List all tables"
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





# Database Commands
db-up: ## Start PostgreSQL database
	docker-compose up -d

db-down: ## Stop PostgreSQL database
	docker-compose down

db-push: ## Push schema to database
	pnpm db push

db-studio: ## Open Drizzle Studio
	pnpm db studio

db-generate: ## Generate migrations
	pnpm db generate

db-reset: ## Reset database (development only)
	pnpm db reset




# Database Query Commands
db-connect: ## Connect to database with psql
	docker exec -it tanstack-ecom-db-1 psql -U vare -d tanstack-ecom

db-tables: ## List all tables
	docker exec -it tanstack-ecom-db-1 psql -U vare -d tanstack-ecom -c "\dt"

db-users: ## Show all users
	docker exec -it tanstack-ecom-db-1 psql -U vare -d tanstack-ecom -c "SELECT id, name, email, email_verified, created_at FROM \"user\" ORDER BY created_at DESC;"

db-sessions: ## Show all sessions
	docker exec -it tanstack-ecom-db-1 psql -U vare -d tanstack-ecom -c "SELECT id, user_id, expires_at, created_at FROM session ORDER BY created_at DESC LIMIT 10;"

db-accounts: ## Show all OAuth accounts
	docker exec -it tanstack-ecom-db-1 psql -U vare -d tanstack-ecom -c "SELECT id, provider_id, user_id, created_at FROM account ORDER BY created_at DESC;"




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