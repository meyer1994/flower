# flower

Vue 3 + Nuxt 4 + tRPC app on Cloudflare Workers (D1 + R2).

## Pages

```text
/                 Landing
/signin           Sign in / sign up
/profile          Current user session
/dash             Dashboard layout
/dash/counter     Counter demo
/dash/files       File upload / list / delete
```

## Endpoints

```text
/api/auth/*       Better Auth handler
/api/trpc         tRPC endpoint
```

### tRPC procedures

```text
ping              query     public
health            query     public
counter.get       query     protected
counter.inc       mutation  protected
counter.dec       mutation  protected
files.list        query     protected
files.create      mutation  protected  (FormData, max 10MB)
files.delete      mutation  protected
```

## Development

```bash
pnpm install
cp -v .env.example .env
pnpm db:migrate -- --local
pnpm dev
```

## Database

```bash
# After schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate -- --local
pnpm db:migrate -- --remote
```

## Deploy

```bash
pnpm build
pnpm cf:deploy
```

Regenerate Worker binding types after changing `wrangler.jsonc`:

```bash
pnpm cf:types
```
