import { definePlugin } from '../../helper'
import { Tracker } from './tracker'
import { EventData } from '../../types'

export const pluginTracker = definePlugin(() => {
  return (ctx) => {
    const tracker = Tracker.getInstance()
    tracker.registerCallback((eventData: EventData) => ctx.appendEventData(eventData))
    ctx.registerMethod('trackTargetBeginExposure', tracker.targetBeginExposure)
    ctx.registerMethod('trackTargetEndExposure', tracker.targetEndExposure)
    ctx.registerMethod('trackPageBeginExposure', tracker.pageBeginExposure)
    ctx.registerMethod('trackPageEndExposure', tracker.pageEndExposure)
    ctx.registerMethod('trackTargetClick', tracker.targetClick)
  }
})
