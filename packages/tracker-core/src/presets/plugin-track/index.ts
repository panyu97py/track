import { definePlugin } from '../../helper'
import { Tracker } from './tracker'
import { EventData } from './types'

export const pluginTrack = definePlugin(() => {
  return (ctx) => {
    const tracker = Tracker.getInstance()
    tracker.registerCallback((eventData: EventData) => ctx.applyMethod('', eventData))
    ctx.registerMethod('trackTargetBeginExposure', tracker.targetBeginExposure)
    ctx.registerMethod('trackTargetEndExposure', tracker.targetEndExposure)
    ctx.registerMethod('trackTargetClick', tracker.targetClick)
  }
})
