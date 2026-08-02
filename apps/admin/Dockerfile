FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS builder
WORKDIR /app
RUN pnpm add -g turbo@^2
COPY . .
RUN turbo prune admin --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm --filter @caguei/db exec prisma generate
RUN pnpm run build --filter=admin

FROM base AS runner
WORKDIR /app
COPY --from=installer /app .
EXPOSE 3001
CMD ["pnpm", "--filter", "admin", "start"]
