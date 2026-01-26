export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('cloudflare:queue', async (event) => {
    if (event.batch.queue !== 'flower') return
    for (const message of event.batch.messages) {
      console.info('[server.queue] queue message', JSON.stringify(message, null, 2))
    }
  })
})
