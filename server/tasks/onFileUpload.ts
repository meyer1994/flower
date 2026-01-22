import type { TRPCContext } from '../lib/trpc'

export const onFileUpload = async (key: string, ctx: TRPCContext) => {
  try {
    // We now use the unified set method which handles fetching from storage,
    // extraction (assuming text), and embedding.
    const metadata = await ctx.storage.metadata(key)
    await ctx.vector.set(key, { ...metadata })
  }
  catch (error) {
    console.error(error)
    throw error
  }
}
