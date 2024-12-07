import { definePlugin, EventConfig, EventData, PluginContext } from '@trackerjs/core'
import { eventHooks } from '../../event-hooks'

export const pluginTriggerEvent = definePlugin(() => {
  return (ctx: PluginContext) => {
    eventHooks.trackPageBeginExposure.tap((pagePath:string, params:Record<string, any>) => ctx.trackPageBeginExposure(pagePath, params))

    eventHooks.trackPageEndExposure.tap((pagePath:string, params:Record<string, any>) => ctx.trackPageEndExposure(pagePath, params))

    eventHooks.trackTargetBeginExposure.tap((eventConfig: EventConfig) => ctx.trackTargetBeginExposure(eventConfig))

    eventHooks.trackTargetBeginExposure.tap((eventConfig: EventConfig) => ctx.trackTargetBeginExposure(eventConfig))

    eventHooks.trackTargetClick.tap((eventConfig: EventConfig) => ctx.trackTargetClick(eventConfig))

    eventHooks.appendEventData.tap((eventData: EventData) => ctx.appendEventData(eventData))
  }
})
