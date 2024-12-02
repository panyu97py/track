import { EventHook } from '@trackerjs/core'

export const eventHooks = {
  appendEventData: new EventHook('appendEventData'),
  trackTargetClick: new EventHook('trackTargetClick'),
  trackTargetBeginExposure: new EventHook('trackTargetBeginExposure'),
  trackTargetEndExposure: new EventHook('trackTargetBeginExposure')
}
