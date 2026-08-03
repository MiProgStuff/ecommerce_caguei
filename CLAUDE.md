# CLAUDE.md — caguei-ecommerce

Guia de arranque para quem (humano ou Claude) abre este projeto do zero. Escrito
com base em problemas reais já encontrados e resolvidos neste repositório, não
numa varredura genérica de código — leia isto antes de assumir que algo está
partido ou de repetir trabalho já feito.

---

## 1. O que é isto

Monorepo pnpm/Turborepo de e-commerce de streetwear vintage/collegiate (marca
**caguei**, domínio futuro `cagueistudio.com`, ainda não em produção).

```
apps/
  store/   Next.js 16 — loja para clientes (produtos, carrinho, checkout Stripe)
  admin/   Next.js 16 — painel administrativo (catálogo, encomendas, staff)
  api/     Express — API central (auth, pagamentos, webhooks, uploads)
packages/
  db/               Prisma 7 + PostgreSQL, schema partilhado
  validations/       Schemas Zod partilhados (usados por api + admin)
  eslint-config/     Config partilhada (não usada de facto por nenhuma app — ver §7)
  typescript-config/ Idem
branding/            Assets brutos da marca (PDF do plano, fotos em alta-res).
                     NÃO está no git (.gitignore). Cópias web-ready reais estão
                     em apps/{store,admin}/public/brand/.
```

Cada app tem o seu próprio `AGENTS.md` com regras específicas — lê-o antes de
mexer nessa app. Este ficheiro cobre o que é transversal.

---

## 2. Arrancar do zero

```bash
pnpm install
docker compose up -d db minio
```

Depois, gerar o cliente Prisma e preparar a base de dados:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caguei_db" \
  pnpm --filter @caguei/db exec prisma generate

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caguei_db" \
  pnpm --filter @caguei/db exec prisma db push

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caguei_db" \
  ./apps/api/node_modules/.bin/tsx packages/db/prisma/seed.ts
```

**Não uses `pnpm dev` na raiz.** O `.env` só define um `PORT` genérico (4000),
e as três apps colidem quando o turbo as arranca todas ao mesmo tempo com a
mesma variável. Arranca cada uma com a porta explícita:

```bash
PORT=4000 pnpm --filter api dev
PORT=3000 pnpm --filter store dev
PORT=3001 pnpm --filter admin dev
```

- Loja: http://localhost:3000
- Admin: http://localhost:3001/login
- API: http://localhost:4000

### Testar pagamentos (Stripe)

Não há webhook endpoint permanente configurado no Dashboard — usa o Stripe CLI
localmente:

```bash
~/.local/bin/stripe listen --api-key "$(grep STRIPE_SECRET_KEY .env | cut -d'\"' -f2)" \
  --forward-to localhost:4000/api/webhooks/stripe
```

Isto imprime um `whsec_...` **novo a cada sessão** — copia-o para
`STRIPE_WEBHOOK_SECRET` no `.env` e reinicia a API. Se os webhooks pararem de
confirmar encomendas, é quase sempre isto (secret desatualizado).

Se o Stripe CLI não estiver instalado: binário em
`https://github.com/stripe/stripe-cli/releases`, `stripe_x.y.z_linux_x86_64.tar.gz`,
extrair para `~/.local/bin/stripe`. Não precisa de `stripe login` — usa
`--api-key` diretamente com a tua `STRIPE_SECRET_KEY`.

---

## 3. Armadilhas já apanhadas (não repetir)

### 3.1 Nunca uses `0.0.0.0` em variáveis `NEXT_PUBLIC_*_URL` / `BETTER_AUTH_URL` / `MINIO_PUBLIC_URL`
`0.0.0.0` é um endereço de bind, não um destino routável — o browser não
consegue mesmo ligar-se lá. Isto causou horas de debugging de login
"intermitente" (às vezes funcionava, às vezes não, dependendo do browser). O
`.env` atual já está correto (`localhost` para dev); há um comentário de aviso
em cada variável relevante. Se voltares a ver falhas de sessão erráticas —
verifica isto primeiro.

### 3.2 Rede Docker bloqueada pelo UFW
Neste host, o UFW tem uma regra `REJECT OUT` para `172.16.0.0/12`, que inclui
a rede padrão do Docker Compose. Sintoma: `docker compose up` corre bem, mas
qualquer porta publicada (`localhost:5432`, `localhost:9000`, etc.) dá
"connection reset" mesmo com o container saudável. Fix:
```bash
sudo ufw insert 1 allow out to <subnet-do-docker-compose>  # ex: 172.18.0.0/16
sudo ufw reload
```
Confirma a subnet real com `docker network inspect caguei-ecommerce_default --format '{{json .IPAM.Config}}'`.

### 3.3 `apps/api` precisa de `tsx`, não `ts-node`
`better-auth/node` é ESM-puro; `ts-node` não interopera. O `package.json` já
usa `tsx` no script `dev`. O `tsconfig.json` também precisa de
`moduleResolution: "node16"` para resolver o `@prisma/client` gerado pelo
Prisma 7 (exports condicionais). Ambos já corrigidos — não reverter.

### 3.4 pnpm store mismatch entre utilizadores do SO
Se `pnpm install`/`pnpm add` pedir para reinstalar tudo do zero, é porque o
`node_modules` foi originalmente instalado por outro utilizador do sistema.
Usa `--store-dir <path-do-store-original>` para evitar a reinstalação
completa.

### 3.5 Documentação desatualizada
`docs/getting-started.md` e `docs/architecture.md` ainda descrevem a
identidade "luxury minimalist" antiga e podem não refletir o modelo de auth
atual do admin (ver §5). `docs/design-system.md` está atualizado e é a fonte
de verdade da identidade visual. Não confies cegamente nos outros dois sem
verificar contra o código.

---

## 4. Identidade de marca

Paleta e tipografia completas em `docs/design-system.md`. Resumo:

- **Cor primária:** bordô `#7A1F1F` (extraído do logo real, `branding/caguei/*.svg`)
- **Secundárias:** marinho `#22314F`, verde-oliva `#6E7345`, cru `#F5EFE1`
- **Tipografia loja:** `Anton` (display) + `Hanken Grotesk` (corpo)
- **Tipografia admin:** `Inter` + `JetBrains Mono` (independente da loja, dashboard prático escuro — não adota a paleta cru/oliva)
- Cantos arredondados são normais em ambas as apps — não há regra de 0px.
- Logos web-ready: `apps/{store,admin}/public/brand/`. Fotografia real de
  produto em `apps/store/public/brand/photos/`.

---

## 5. Autenticação — dois modelos diferentes, não confundir

### `apps/store` — email + OTP, para clientes
Instância `better-auth` própria em `apps/store/lib/auth.ts`. Qualquer pessoa
pode criar conta. `role` por omissão é `CUSTOMER`.

### `apps/admin` — email + OTP, mas com verificação de papel
Instância `better-auth` **separada** em `apps/admin/lib/auth.ts` (mesma base
de dados, config independente). Criar conta aqui também é OTP por email — mas
`app/(main)/layout.tsx` exige adicionalmente `session.user.role` ser `ADMIN`
ou `SUPER_ADMIN`. Uma conta nova fica sempre `CUSTOMER` e é redirecionada de
volta para `/login` — provar o email não dá acesso ao painel.

**Este modelo já foi substituído uma vez por um código de acesso único
partilhado, e depois revertido de propósito** a pedido explícito do
utilizador, para garantir rastreabilidade real (saber *quem* fez cada ação).
Não voltar ao modelo de código único sem confirmar com o utilizador primeiro.

### Gestão de staff (só SUPER_ADMIN)
- `PATCH /api/users/:id/role` promove/revoga `ADMIN` — protegido por
  `requirePermission('users', 'UPDATE')`. O papel `ADMIN` seedado só tem
  `users:READ`, nunca `UPDATE`, por isso só o bypass de `SUPER_ADMIN` nesse
  middleware passa.
- `SUPER_ADMIN` **nunca** é editável via API (bloqueado explicitamente no
  controller) — só é atribuído via `packages/db/prisma/seed.ts` (email
  hardcoded: `carlopes24@gmail.com`). Isto é deliberado, para evitar
  auto-bloqueio ou escalamento de privilégio por bug.
- UI em `apps/admin/src/features/users-permissions/components/UsersPermissionsPage.tsx`
  — já liga a dados reais, não é mock.

### RBAC subjacente
`packages/db/prisma/schema.prisma` tem `Role`/`Permission`/`RolePermission`
completos (recurso × ação), aplicados via `requirePermission()` em
`apps/api/src/middleware/permission.middleware.ts`. **O utilizador considera
este sistema granular desajustado às necessidades reais do negócio e pretende
simplificá-lo** — não investir esforço a expandi-lo (novos recursos/ações)
sem pedido explícito.

---

## 6. Preparação para produção (`cagueistudio.com`)

Feito só a nível de código/config — **sem** Nginx, SSL ou DNS reais ainda:

- `.env` tem um bloco comentado com os valores de produção
  (`https://cagueistudio.com`, `https://admin.cagueistudio.com`,
  `https://api.cagueistudio.com`) prontos a ativar — só descomentar.
- CORS na API (`apps/api/src/app.ts`) e `trustedOrigins` nas três instâncias
  better-auth já aceitam `cagueistudio.com` e qualquer subdomínio
  (`*.cagueistudio.com`), além de `localhost`.
- Metadados (Open Graph, favicon, `robots`) já referenciam o domínio via
  `NEXT_PUBLIC_APP_URL`/`NEXT_PUBLIC_ADMIN_URL`.
- MinIO **não** tem CORS configurado (o SDK JS usado não expõe essa API, e
  não é necessário para `<img>`/`next/image`) — só relevante se um dia
  precisares de `fetch()` bytes de imagem no browser.

---

## 7. Coisas removidas de propósito (não recriar sem motivo)

- `packages/ui/` — template do `create-turbo`, nunca importado por nenhuma app.
- SVGs placeholder do Next.js (`file.svg`, `globe.svg`, etc.) em `public/` de ambas as apps.
- `packages/eslint-config`/`typescript-config` continuam a existir mas
  nenhuma app os usa de facto (todas usam `eslint-config-next` diretamente,
  nenhum `tsconfig.json` faz `extends` deles) — só são dependência de
  `packages/validations`.

---

## 8. Referências

- `docs/design-system.md` — paleta e tipografia (atualizado, fonte de verdade)
- `docs/api-reference.md` — endpoints da API central
- `apps/store/AGENTS.md`, `apps/admin/AGENTS.md` — regras específicas de cada app
