import { EventHook } from '@trackerjs/core'

export const eventHooks = {
  appendEventData: new EventHook('appendEventData'),
  trackTargetBeginExposure: new EventHook('trackTargetBeginExposure'),
  trackTargetEndExposure: new EventHook('trackTargetBeginExposure')
}
