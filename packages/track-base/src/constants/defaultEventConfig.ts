import * as EVENT_TYPE from './eventType'
import * as EVENT_NAME from './eventName'
import type {TargetTrackConfig} from "../interface";

export const PAGE_EXPOSURE_CONFIG: TargetTrackConfig = {
    eventExposureConfig: {
        eventName: EVENT_NAME.PAGE_EXPOSURE,
        eventType: EVENT_TYPE.EXPOSURE
    }
}
