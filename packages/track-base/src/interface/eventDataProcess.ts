import type {SimpleEventData, EventData} from './eventData'
import type {EventConfig, EventType, TargetTrackConfig} from "./eventConfig";
import {FiledlEventIdSimpleEventData} from "./eventData";

export type SubmitTrackDataType = (trackData: EventData) => void;

export interface TrackEventDataProcessInstance {

    exposureEventDataMap: Map<string, FiledlEventIdSimpleEventData>;

    clickEventDataMap: Map<string, FiledlEventIdSimpleEventData>;

    getEventConfig: (trackConfig: TargetTrackConfig, type: EventType) => EventConfig

    generateEventKey: (trackConfig: TargetTrackConfig, config: EventConfig) => string;

    generateEventData: (trackConfig: TargetTrackConfig, config: EventConfig) => FiledlEventIdSimpleEventData;

    fillReferrerId: (trackData: SimpleEventData, config: EventConfig) => FiledlEventIdSimpleEventData;

    fillEndTime: (trackData: FiledlEventIdSimpleEventData, type: EventType) => EventData;

    targetBeginExposure: (trackConfig: TargetTrackConfig) => void;

    targetEndExposure: (trackConfig: TargetTrackConfig) => void;

    targetClick: (trackConfig: TargetTrackConfig) => void;

    submitTrackData: SubmitTrackDataType;
}
