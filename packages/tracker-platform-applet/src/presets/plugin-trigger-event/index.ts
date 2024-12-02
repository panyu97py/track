import { definePlugin, EventData, PluginContext } from '@trackerjs/core'
import { eventHooks } from '../../event-hooks'

export const pluginTriggerEvent = definePlugin(() => {
  return (ctx: PluginContext) => {
    eventHooks.trackTargetClick.tap((eventName:string, extendData:Record<string, any>) => {
      ctx.trackTargetClick({ eventClickName: eventName, extendData })
    })

    eventHooks.trackTargetBeginExposure.tap((eventName:string, extendData:Record<string, any>) => {
      ctx.trackTargetBeginExposure({ eventExposureName: eventName, extendData })
    })

    eventHooks.trackTargetBeginExposure.tap((eventName:string, extendData:Record<string, any>) => {
      ctx.trackTargetBeginExposure({ eventExposureName: eventName, extendData })
    })

    eventHooks.appendEventData.tap((eventData:EventData) => {
      ctx.appendEventData(eventData)
    })
  }
})
