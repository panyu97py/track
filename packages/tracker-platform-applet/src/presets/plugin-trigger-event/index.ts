import { definePlugin, EventConfig, EventData, PluginContext } from '@trackerjs/core'
import { eventHooks } from '../../event-hooks'

export const pluginTriggerEvent = definePlugin(() => {
  return (ctx: PluginContext) => {
    eventHooks.trackTargetClick.tap((eventConfig: EventConfig) => {
      ctx.trackTargetClick(eventConfig)
    })

    eventHooks.trackTargetBeginExposure.tap((eventConfig: EventConfig) => {
      ctx.trackTargetBeginExposure(eventConfig)
    })

    eventHooks.trackTargetBeginExposure.tap((eventConfig: EventConfig) => {
      ctx.trackTargetBeginExposure(eventConfig)
    })

    eventHooks.appendEventData.tap((eventData: EventData) => {
      ctx.appendEventData(eventData)
    })
  }
})
