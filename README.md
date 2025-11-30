# [React TanStarter](https://github.com/dotnize/react-tanstarter)

A minimal starter template for 🏝️ TanStack Start. [→ Preview here](https://tanstarter.nize.ph/)

- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Rolldown Vite](https://vite.dev/guide/rolldown.html) + [Nitro v3](https://v3.nitro.build/) (alpha)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [Better Auth](https://www.better-auth.com/)

## 📚 Documentation

For a detailed explanation of the architecture, setup, and how everything works together, see the [Architecture Guide](./docs/architecture.md).

## Getting Started

1. [Use this template](https://github.com/new?template_name=react-tanstarter&template_owner=dotnize) or clone this repository with gitpick:

   ```bash
   npx gitpick dotnize/react-tanstarter myapp
   cd myapp
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file based on [`.env.example`](./.env.example).

4. Push the schema to your database with drizzle-kit:

   ```bash
   pnpm db push
   ```

   https://orm.drizzle.team/docs/migrations

5. Run the development server:

   ```bash
   pnpm dev
   ```

   The development server should now be running at [http://localhost:3000](http://localhost:3000).

## Deploying to production

The [vite config](./vite.config.ts#L16-L17) is currently configured to use [Nitro v3](https://v3.nitro.build) (alpha) to deploy on Vercel, but can be easily switched to other providers.

Refer to the [TanStack Start hosting docs](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) for deploying to other platforms.

## Issue watchlist

- [Router/Start issues](https://github.com/TanStack/router/issues) - TanStack Start is in RC.
- [Devtools releases](https://github.com/TanStack/devtools/releases) - TanStack Devtools is in alpha and may still have breaking changes.
- [Rolldown Vite](https://vite.dev/guide/rolldown.html) - We're using the experimental Rolldown-powered version of Vite by default.
- [Nitro v3 alpha](https://v3.nitro.build/) - The template is configured with Nitro v3 alpha by default.

## Goodies

#### Scripts

We use **pnpm** by default, but you can modify these scripts in [package.json](./package.json) to use your preferred package manager.

- **`auth:generate`** - Regenerate the [auth db schema](./src/lib/db/schema/auth.schema.ts) if you've made changes to your Better Auth [config](./src/lib/auth/auth.ts).
- **`db`** - Run [drizzle-kit](https://orm.drizzle.team/docs/kit-overview) commands. (e.g. `pnpm db generate`, `pnpm db studio`)
- **`ui`** - The shadcn/ui CLI. (e.g. `pnpm ui add button`)
- **`git:commit`** - Automated git workflow script. Add, commit, and push with customizable task keywords. (e.g. `pnpm git:commit -t feature -m "Add user authentication"`)
- **`format`**, **`lint`**, **`check-types`** - Run Prettier, ESLint, and check TypeScript types respectively.
  - **`check`** - Run all three above. (e.g. `pnpm check`)
- **`deps`** - Selectively upgrade dependencies via taze.

#### Makefile Shortcuts

For convenience, a [Makefile](./Makefile) is provided with shortcuts for common development tasks:

```bash
# Development
make dev          # Start development server
make build        # Build for production
make dev-full     # Start database + dev server

# Database
make db-up        # Start PostgreSQL
make db-push      # Push schema to database
make db-studio    # Open Drizzle Studio

# Code Quality
make check        # Run all checks (format, lint, types)
make format       # Format code
make lint         # Run ESLint

# Combined Workflows
make setup        # Complete project setup
make pre-commit   # Run pre-commit checks
make deploy-prep  # Prepare for deployment

# Info & Status
make help         # Show all available commands
make status       # Show current project status
```

#### Git Automation Script

The `git:commit` script automates the git workflow with customizable task keywords:

```bash
# Basic usage
pnpm git:commit -t feature -m "Add user authentication"

# Without task keyword
pnpm git:commit -m "Update documentation"

# Direct script usage
node scripts/git-commit.js -t bugfix -m "Fix login validation"
```

**Options:**

- `-t, --task <type>` - Task type keyword (feature, bugfix, refactor, docs, etc.)
- `-m, --message <msg>` - Commit message (required)
- `-h, --help` - Show help

**Examples:**

- `pnpm git:commit -t feature -m "Add user authentication"` → `[FEATURE] Add user authentication`
- `pnpm git:commit -t bugfix -m "Fix login validation"` → `[BUGFIX] Fix login validation`
- `pnpm git:commit -t refactor -m "Clean up component structure"` → `[REFACTOR] Clean up component structure`

The script performs: `git add .` → `git commit -m "[TASK] message"` → `git push`

#### Utilities

- [`auth/middleware.ts`](./src/lib/auth/middleware.ts) - Sample middleware for forcing authentication on server functions. (see [#5](https://github.com/dotnize/react-tanstarter/issues/5#issuecomment-2615905686) and [#17](https://github.com/dotnize/react-tanstarter/issues/17#issuecomment-2853482062))
- [`theme-toggle.tsx`](./src/components/theme-toggle.tsx), [`theme-provider.tsx`](./src/components/theme-provider.tsx) - A theme toggle and provider for toggling between light and dark mode. ([#7](https://github.com/dotnize/react-tanstarter/issues/7#issuecomment-3141530412))

## License

Code in this template is public domain via [Unlicense](./LICENSE). Feel free to remove or replace for your own project.

## Also check out

- [@tanstack/create-start](https://github.com/TanStack/create-tsrouter-app/blob/main/cli/ts-create-start/README.md) - The official CLI tool from the TanStack team to create Start projects.
- [awesome-tanstack-start](https://github.com/Balastrong/awesome-tanstack-start) - A curated list of awesome resources for TanStack Start.
