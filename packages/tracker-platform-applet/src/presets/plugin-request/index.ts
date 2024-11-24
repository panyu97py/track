import { definePlugin } from '@trackerjs/core'

export const pluginAppletRequest = definePlugin(() => {
  return (ctx) => {
    console.log('pluginAppletRequest', { ctx })
  }
})
