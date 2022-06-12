export type EventType = 'CLICK' | 'EXPOSURE';

export interface EventConfig {
    eventType: EventType;
    eventName: string;
    extendsPrimaryKey?: string;
    originEventName?: string
    originEventType?: string
}

export interface TargetTrackConfig {
    eventClickConfig?: EventConfig;
    eventExposureConfig?: EventConfig;
    extendData?: Record<string, any>
}
