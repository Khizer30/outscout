# OutScout

A geo-targeted B2B lead generation and outreach platform. Find local businesses via Google Maps, enrich them with contact details, and reach out via WhatsApp, email, or cold call — all from one dashboard.

> Built for freelancers and agencies targeting Pakistan and Gulf markets where WhatsApp is the dominant communication channel.

---

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

See [BUSINESS_LOGIC.md](./docs/BUSINESS_LOGIC.md) for a full breakdown of the product concept, workflow, and outreach rules.

---

## Repository Structure

```
outscout/
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
├── docs/
│   └── BUSINESS_LOGIC.md   # Product concept and business rules
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

Three separate `.env` files, each scoped to what consumes it. Copy the matching example file before running locally:

- [`.env.example`](.env.example) — Docker Compose only, substituted into `compose.yaml` for the `grafana` service. Not read by either app.
- [`apps/api/.env.example`](apps/api/.env.example) — also the `env_file` loaded by the `api` and `worker` services in `compose.yaml`.
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
