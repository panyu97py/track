import * as EVENT_TYPE from './eventType'
import * as DEFAULT_EVENT_NAME from './defaultEventName'
import type {TargetTrackConfig} from "../interface";

export const PAGE_EXPOSURE_CONFIG: TargetTrackConfig = {
    eventExposureConfig: {
        eventName: DEFAULT_EVENT_NAME.PAGE_EXPOSURE,
        eventType: EVENT_TYPE.EXPOSURE
    }
}
