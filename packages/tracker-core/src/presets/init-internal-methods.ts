import { definePlugin } from '../helper'
import { hooks } from '../hooks'

export const initInternalMethods = definePlugin(() => {
  return (ctx) => {
    ctx.registerMethod('modifyEventData', hooks.modifyEventData.tap)
  }
})
