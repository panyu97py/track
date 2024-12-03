import { eventHooks } from './event-hooks'
import { EventConfig, EventData } from '@trackerjs/core'

export const trackTargetClick = (eventConfig: EventConfig) => {
  eventHooks.trackTargetClick.call(eventConfig)
}

export const trackTargetEndExposure = (eventConfig: EventConfig) => {
  eventHooks.trackTargetEndExposure.call(eventConfig)
}

export const trackTargetBeginExposure = (eventConfig: EventConfig) => {
  eventHooks.trackTargetEndExposure.call(eventConfig)
}

export const appendEventData = (eventData:EventData) => {
  eventHooks.appendEventData.call(eventData)
}
