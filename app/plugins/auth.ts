/**
 * Adapted from:
 * https://github.com/atinux/nuxthub-better-auth/blob/main/app/composables/auth.ts
 */
export default defineNuxtPlugin(async () => {
  const auth = useAuth()
  return { provide: { auth: auth.client } }
})
