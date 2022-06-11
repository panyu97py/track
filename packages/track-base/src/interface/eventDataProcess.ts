import type {simpleEventData, eventData} from './eventData'
import type {eventConfig, eventType, targetTrackConfig} from "./eventConfig";

export type submitTrackDataType = (trackData: eventData) => void;

export interface TrackEventDataProcessInstance {

    exposureEventDataList: Map<string, simpleEventData>;

    clickEventDataList: Map<string, simpleEventData>;

    generateEventData: (trackConfig: targetTrackConfig, type: eventType) => simpleEventData;

    fillReferrerId: (trackData: simpleEventData, config: eventConfig) => simpleEventData;

    targetExposureCount: (trackConfigList: targetTrackConfig[]) => void;

    targetBeginExposure: (trackConfig: targetTrackConfig) => void;

    targetEndExposure: (trackConfig: targetTrackConfig) => void;

    targetClick: (trackConfig: targetTrackConfig) => void;

    submitTrackData: submitTrackDataType;
}
