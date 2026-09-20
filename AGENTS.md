# Flower Agent Guide

Vue 3 + Nuxt 4 + tRPC template deployed on Cloudflare Workers with D1 (SQLite) and R2.

## Stack

- **Frontend**: Vue 3, Nuxt 4, Nuxt UI, VueUse
- **Backend**: tRPC, Drizzle ORM, H3
- **Auth**: Better Auth (email/password)
- **DB**: Cloudflare D1 (SQLite)
- **Files**: S3-compatible storage (R2 / MinIO via `@aws-sdk`)
- **Package Manager**: pnpm

## Structure

```
├── app/                      # Frontend (Vue/Nuxt)
│   ├── components/           # AsyncData.vue
│   ├── pages/                # routes (/, /signin, /profile, /dash/*)
│   └── plugins/              # auth.ts, trpc.ts
├── server/
│   ├── api/
│   │   ├── auth/[...all].ts  # Better Auth handler
│   │   └── trpc/[trpc].ts    # tRPC endpoint
│   ├── db/                   # schema.ts, auth.ts, migrations/
│   ├── lib/                  # auth.ts, drizzle.ts, files.ts, trpc.ts
│   └── trpc/                 # appRouter (index.ts)
├── shared/                   # wrangler.d.ts, env.d.ts
├── auth.config.ts            # Better Auth CLI config
├── drizzle.config.ts
└── wrangler.jsonc            # D1 + R2 bindings
```

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
/api/auth/*       Better Auth
/api/trpc         tRPC
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

---

## Commands

### Dev

```bash
pnpm install
cp -v .env.example .env
pnpm db:migrate -- --local
pnpm dev              # Nuxt dev server (localhost:3000)
pnpm build            # production build
pnpm preview          # preview production build locally
pnpm typecheck        # TypeScript type check
pnpm lint             # ESLint
pnpm lint:fix         # auto-fix lint issues
pnpm clean            # remove .output .wrangler .nuxt node_modules
```

### Database (Drizzle + Wrangler D1)

```bash
pnpm db:generate                 # regenerate Better Auth schema + drizzle migration
pnpm db:migrate -- --local       # apply migrations to local D1
pnpm db:migrate -- --remote      # apply migrations to remote D1

# Direct wrangler D1 commands
wrangler d1 execute flower --local --command "SELECT * FROM counter"
wrangler d1 execute flower --remote --command "SELECT * FROM counter"
```

### Cloudflare

```bash
# Regenerate TypeScript bindings after changing wrangler.jsonc
pnpm cf:types

# Deploy (build first)
pnpm build
pnpm cf:deploy                   # wrangler --cwd .output deploy
```

### Local secrets

Use `.env` for Nuxt/`nuxt dev`. For Wrangler-only runs, create `.dev.vars`
(gitignored):

```bash
BETTER_AUTH_SECRET=my-local-secret
```

---

## Database (Drizzle)

Always access the DB via `ctx.db` in tRPC procedures.

### Table pattern

```typescript
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const TCounter = sqliteTable('counter', {
  id: text('id').primaryKey(),
  count: integer('count').notNull().default(0),
})
```

Auth tables live in `server/db/auth.ts` (generated via `pnpm auth:generate`) and
are re-exported from `server/db/schema.ts`.

### Queries

```typescript
await ctx.db.select().from(TTable).where(eq(TTable.id, id))
await ctx.db.insert(TTable).values({ ... }).returning()
await ctx.db.update(TTable).set({ ... }).where(eq(TTable.id, id)).returning()
await ctx.db.delete(TTable).where(eq(TTable.id, id)).returning()

// Single row (D1 / SQLite)
await ctx.db.select().from(TTable).where(eq(TTable.id, id)).get()
```

---

## tRPC (Backend)

Procedures live in `server/trpc/index.ts`. Context is built in `server/lib/trpc.ts`.

### Route template

```typescript
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { TTable } from '~~/server/db/schema'
import { baseProcedure, protectedProcedure, createTRPCRouter } from '~~/server/lib/trpc'

export const appRouter = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.select().from(TTable)
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const row = await ctx.db.insert(TTable).values(input).returning().get()
      if (!row) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      return row
    }),
})
```

### Conventions

- Always validate input with Zod
- Skip try/catch — keep routes simple
- Throw `TRPCError` for not-found / auth / internal errors
- Use `protectedProcedure` for authenticated routes
- Context: `ctx.db`, `ctx.files`, `ctx.auth`, `ctx.session`

---

## tRPC (Frontend)

```typescript
const { $trpc } = useNuxtApp()
```

**Always wrap tRPC calls in `useAsyncData`** — for both queries and mutations.

### Queries

```typescript
const { data, refresh, status } = await useAsyncData('counter',
  () => $trpc.counter.get.query())

// With dynamic params — include params in cache key
const { data } = await useAsyncData(`files-${prefix}`,
  () => $trpc.files.list.query())
```

### Mutations

```typescript
const { execute: doDelete, status } = await useAsyncData(null,
  () => $trpc.files.delete.mutate({ id }),
  { immediate: false },
)

const handleDelete = async () => {
  await doDelete()
  await refresh()
}
```

---

## Frontend Components

### AsyncData Component

`AsyncData.vue` is a renderless wrapper around `useAsyncData` that exposes
`data`, `status`, `error`, `refresh`, and `clear` via a default slot.

```vue
<template>
  <AsyncData fetch-key="files" :handler="() => $trpc.files.list.query()">
    <template #default="{ data, status, refresh }">
      <div v-if="status === 'pending'">Loading…</div>
      <pre v-else>{{ data }}</pre>
    </template>
  </AsyncData>
</template>
```

### Data Flow

**Fetch at page level, pass down via props, emit events up.** Child components
must not call the API.

### Form Components

- Zod schema at the top, export `FormXxxData` type
- Props: `defaultValue?`, `loading?`
- Watch `defaultValue` to sync state
- Emit `submit: [e: Schema]`, use `@submit.prevent`

```vue
<script setup lang="ts">
import * as z from 'zod'

const schema = z.object({ name: z.string().min(1) })
type Schema = z.output<typeof schema>
export type FormExampleData = Schema

const props = withDefaults(defineProps<{
  defaultValue?: Partial<Schema>
  loading?: boolean
}>(), { defaultValue: () => ({}), loading: false })

const state = reactive<Partial<Schema>>(props.defaultValue)
watch(() => props.defaultValue, (v) => v && Object.assign(state, v))

const emits = defineEmits<{ submit: [e: Schema] }>()
</script>

<template>
  <UForm :schema="schema" :state="state" @submit.prevent="(e) => emits('submit', e.data)">
    <UFormField name="name" label="Name">
      <UInput v-model="state.name" class="w-full" />
    </UFormField>
    <UButton type="submit" label="Save" />
  </UForm>
</template>
```

---

## UI & Theming

| Token     | Use               |
| --------- | ----------------- |
| primary   | CTAs, brand       |
| secondary | Alt actions       |
| success   | Confirmations     |
| info      | Neutral alerts    |
| warning   | Attention         |
| error     | Destructive       |
| neutral   | Backgrounds, text |

```vue
<UButton color="error">Delete</UButton>
<UButton color="success">Save</UButton>
```

---

## Links

- [Nuxt](https://nuxt.com/docs) · [Nuxt UI](https://ui.nuxt.com/getting-started)
- [tRPC](https://trpc.io/docs) · [tRPC-Nuxt](https://trpc-nuxt.pages.dev/setup/)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview) · [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Better Auth](https://www.better-auth.com/docs)
