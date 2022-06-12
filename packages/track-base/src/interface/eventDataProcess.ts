import type {SimpleEventData, EventData} from './eventData'
import type {EventConfig, EventType, TargetTrackConfig} from "./eventConfig";

export type SubmitTrackDataType = (trackData: EventData) => void;

export interface TrackEventDataProcessInstance {

    exposureEventDataMap: Map<string, SimpleEventData>;

    clickEventDataMap: Map<string, SimpleEventData>;

    getEventConfig: (trackConfig: TargetTrackConfig, type: EventType) => EventConfig

    generateEventKey: (trackData: SimpleEventData, config: EventConfig) => string;

    generateEventData: (trackConfig: TargetTrackConfig, config: EventConfig) => SimpleEventData;

    fillReferrerId: (trackData: SimpleEventData, config: EventConfig) => SimpleEventData;

    targetExposureCount: (trackConfigList: TargetTrackConfig[]) => void;

    targetBeginExposure: (trackConfig: TargetTrackConfig) => void;

    targetEndExposure: (trackConfig: TargetTrackConfig) => void;

    targetClick: (trackConfig: TargetTrackConfig) => void;

    submitTrackData: SubmitTrackDataType;
}
