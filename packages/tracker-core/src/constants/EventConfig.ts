import { TargetTrackConfig } from '../types'
import { BaseEventName, EventType } from './EventData'

export const PAGE_EXPOSURE_CONFIG: Omit<Required<TargetTrackConfig>, 'eventClickConfig' | 'extendData'> = {
  eventExposureConfig: {
    eventName: BaseEventName.PAGE_EXPOSURE,
    eventType: EventType.EXPOSURE,
    canBePageReferrerEvent: true
  }
}
