import { EventHook } from '@trackerjs/core'

export const eventHooks = {
  pageScroll: new EventHook('pageScroll'),
  appendEventData: new EventHook('appendEventData'),
  trackTargetBeginExposure: new EventHook('trackTargetBeginExposure'),
  trackTargetEndExposure: new EventHook('trackTargetBeginExposure')
}
