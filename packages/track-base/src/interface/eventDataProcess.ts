import type {SimpleEventData, EventData} from './eventData'
import type {EventConfig, EventType, TargetTrackConfig} from "./eventConfig";
import {FilledEventIdSimpleEventData} from "./eventData";

export interface TrackEventDataProcessInstance {

    exposureEventDataMap: Map<string, FilledEventIdSimpleEventData>;

    clickEventDataMap: Map<string, FilledEventIdSimpleEventData>;

    getEventConfig: (trackConfig: TargetTrackConfig, type: EventType) => EventConfig

    generateEventKey: (config: EventConfig, extendData?: Record<string,any>) => string;

    generateEventData: (trackConfig: TargetTrackConfig, config: EventConfig) => FilledEventIdSimpleEventData;

    fillReferrerId: (trackData: SimpleEventData, config: EventConfig) => FilledEventIdSimpleEventData;

    fillEndTime: (trackData: FilledEventIdSimpleEventData, type: EventType) => EventData;

    targetBeginExposure: (trackConfig: TargetTrackConfig) => void;

    targetEndExposure: (trackConfig: TargetTrackConfig) => void;

    targetClick: (trackConfig: TargetTrackConfig) => void;
}
