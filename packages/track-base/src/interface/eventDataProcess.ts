import type {SimpleEventData, EventData} from './eventData'
import type {EventConfig, EventType, TargetTrackConfig} from "./eventConfig";
import {FilledEventIdSimpleEventData} from "./eventData";

export type EventDataProcessType = 'CLICK' | 'BEGIN_EXPOSURE' | 'END_EXPOSURE';

export interface TrackEventDataProcessInstance {

    exposureEventDataMap: Map<string, FilledEventIdSimpleEventData>;

    clickEventDataMap: Map<string, FilledEventIdSimpleEventData>;

    getEventConfig: (trackConfig: TargetTrackConfig, type: EventType) => EventConfig

    generateEventKey: (config: EventConfig, extendData?: Record<string, any>) => string;

    generateEventData: (config: EventConfig, extendData?: Record<string, any>) => FilledEventIdSimpleEventData;

    fillReferrerId: (trackData: SimpleEventData, config: EventConfig) => FilledEventIdSimpleEventData;

    fillEndTime: (trackData: FilledEventIdSimpleEventData, type: EventType) => EventData;

    targetBeginExposure: (trackConfig: TargetTrackConfig) => void;

    targetEndExposure: (trackConfig: TargetTrackConfig, isImport?:boolean) => void;

    targetClick: (trackConfig: TargetTrackConfig, isImport?:boolean) => void;
}
