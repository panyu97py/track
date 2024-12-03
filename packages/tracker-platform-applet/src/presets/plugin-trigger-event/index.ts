import { definePlugin, EventConfig, EventData, PluginContext } from '@trackerjs/core'
import { eventHooks } from '../../event-hooks'

export const pluginTriggerEvent = definePlugin(() => {
  return (ctx: PluginContext) => {
    eventHooks.trackTargetBeginExposure.tap((eventConfig: EventConfig) => ctx.trackTargetBeginExposure(eventConfig))

    eventHooks.trackTargetBeginExposure.tap((eventConfig: EventConfig) => ctx.trackTargetBeginExposure(eventConfig))

    eventHooks.trackPageBeginExposure.tap((eventConfig: EventConfig) => ctx.trackPageBeginExposure(eventConfig))

    eventHooks.trackPageEndExposure.tap((eventConfig: EventConfig) => ctx.trackPageEndExposure(eventConfig))

    eventHooks.trackTargetClick.tap((eventConfig: EventConfig) => ctx.trackTargetClick(eventConfig))

    eventHooks.appendEventData.tap((eventData: EventData) => ctx.appendEventData(eventData))
  }
})
