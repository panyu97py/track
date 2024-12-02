import { eventHooks } from './event-hooks'
import { EventData } from '@trackerjs/core'

export const trackTargetClick = (eventName:string, extendData:Record<string, any>) => {
  eventHooks.trackTargetClick.call(eventName, extendData)
}

export const trackTargetEndExposure = (eventName:string, extendData:Record<string, any>) => {
  eventHooks.trackTargetEndExposure.call(eventName, extendData)
}

export const trackTargetBeginExposure = (eventName:string, extendData:Record<string, any>) => {
  eventHooks.trackTargetBeginExposure.call(eventName, extendData)
}

export const appendEventData = (eventData:EventData) => {
  eventHooks.appendEventData.call(eventData)
}
