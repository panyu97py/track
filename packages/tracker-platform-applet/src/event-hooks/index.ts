import { EventHook } from '@trackerjs/core'

export const eventHooks = {
  pageScroll: new EventHook('pageScroll'),
  appendEventData: new EventHook('appendEventData'),
  trackTargetClick: new EventHook('trackTargetClick'),
  trackTargetBeginExposure: new EventHook('trackTargetBeginExposure'),
  trackTargetEndExposure: new EventHook('trackTargetBeginExposure'),
  trackPageBeginExposure: new EventHook('trackPageBeginExposure'),
  trackPageEndExposure: new EventHook('trackPageEndExposure')
}
