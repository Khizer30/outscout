# ---------- Builder ----------
FROM node:24-slim AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml  ./
COPY packages/typescript-config/package.json          ./packages/typescript-config/
COPY packages/dtos/package.json                       ./packages/dtos/
COPY packages/eslint-config/package.json              ./packages/eslint-config/
COPY apps/api/package.json                            ./apps/api/

RUN pnpm install --frozen-lockfile

COPY packages/typescript-config   ./packages/typescript-config
COPY packages/dtos                ./packages/dtos
COPY apps/api                     ./apps/api

RUN pnpm --filter @repo/dtos build
RUN pnpm --filter nestjs build

RUN pnpm --filter nestjs deploy --prod --legacy /deploy/api

# ---------- Production ----------
FROM mcr.microsoft.com/playwright:v1.61.0-jammy

WORKDIR /app

RUN corepack enable

COPY --from=builder /deploy/api ./

EXPOSE 5000

CMD ["pnpm", "start"]
