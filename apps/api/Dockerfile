FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS builder
WORKDIR /app
RUN pnpm add -g turbo@^2
COPY . .
RUN turbo prune api --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm --filter @caguei/db exec prisma generate
# No tsc build step: apps/api runs from source via tsx at container start
# (see apps/api/package.json "start") — better-auth/node is ESM-only and
# fails a plain CommonJS tsc build, so we don't try to pre-compile it.

FROM base AS runner
WORKDIR /app
COPY --from=installer /app .
EXPOSE 4000
CMD ["pnpm", "--filter", "api", "start"]
