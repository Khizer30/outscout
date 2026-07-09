# Turbo Monorepo

A full-stack monorepo built with [Turborepo](https://turbo.build/repo), featuring a NestJS API and a Next.JS web app with shared DTOs.

## Stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Monorepo | Turborepo, pnpm workspaces                    |
| Backend  | NestJS, DDD architecture, Drizzle ORM         |
| Frontend | Next.js 16, Feature-Driven Architecture (FDA) |
| Shared   | Zod DTOs (`packages/dtos`)                    |
| Styling  | Tailwind CSS v4, shadcn/ui                    |
| State    | TanStack Query, Zustand                       |
| Forms    | react-hook-form, Zod                          |
| Toasts   | react-hot-toast                               |
| i18n     | i18next, react-i18next                        |
| Auth     | JWT, bcrypt                                   |
| DevOps   | Docker, Docker Compose, GitHub Actions CI     |

---

## Repository Structure

```
turbo/
├── apps/
│   ├── api/                # NestJS backend (DDD)
│   │   └── src/
│   │       ├── modules/
│   │       │   └── user/
│   │       │       ├── domain/
│   │       │       ├── infrastructure/
│   │       │       ├── presentation/
│   │       │       └── services/
│   │       ├── common/
│   │       ├── database/
│   │       ├── middleware/
│   │       └── types/
│   └── web/                # Next.JS frontend (FDA)
│       ├── app/            # Next.JS App Router
│       ├── features/       # Feature modules
│       │   └── auth/
│       │       ├── api/
│       │       ├── components/
│       │       └── types/
│       └── shared/         # Cross-feature shared code
│           ├── components/
│           ├── hooks/
│           ├── lib/
│           ├── providers/
│           ├── stores/
│           └── types/
├── packages/
│   ├── dtos/               # Shared Zod DTOs
│   ├── eslint-config/      # Shared ESLint config
│   └── typescript-config/  # Shared TypeScript config
├── Dockerfile              # Multi-stage Docker build for the API
├── compose.yaml            # Docker Compose for production API
└── turbo.json
```

---

## Shared DTOs (`packages/dtos`)

Zod schemas live in `packages/dtos/src` and are consumed by both the NestJS backend (via `nestjs-zod`) and the Next.js frontend. Any change to a DTO is immediately reflected in both apps at build time.

---

## Prerequisites

- **Node.js** >= 24
- **pnpm** >= 11.10.0
- **Docker** & **Docker Compose** (for containerised API)

---

## Environment Variables

See the example files for all required variables:

- [`apps/api/.env.example`](apps/api/.env.example)
- [`apps/web/.env.example`](apps/web/.env.example)

---

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Generate and apply database migrations
pnpm --filter nestjs db:generate
pnpm --filter nestjs db:migrate

# 3. Start all apps in watch mode
pnpm dev
```

---

## Database (Drizzle)

All commands are run from the `apps/api` package.

```bash
# Generate migration files from schema changes
pnpm --filter nestjs db:generate

# Apply pending migrations
pnpm --filter nestjs db:migrate

# Push schema directly to the database
pnpm --filter nestjs db:push

# Open Drizzle Studio
pnpm --filter nestjs db:studio
```

---

## CI Pipeline

GitHub Actions runs on every push to `main` and on all pull requests (`.github/workflows/ci.yml`).

**Steps:**

1. Install dependencies (`pnpm install --frozen-lockfile`)
2. Inject `.env` files from repository secrets (`WEB_ENV_FILE`, `API_ENV_FILE`)
3. Lint check
4. Format check
5. TypeScript check
6. Build check

---

## Author

**Syed Muhammad Khizer** — [syed.khizer30@gmail.com](mailto:syed.khizer30@gmail.com)
