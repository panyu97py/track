export type eventType = 'CLICK' | 'EXPOSURE';

export interface eventConfig {
    eventType: eventType;
    eventName: string;
    extendsPrimaryKey?: string;
    originEventName?: string
    originEventType?: string
}

export interface targetTrackConfig {
    eventClickConfig?: eventConfig;
    eventExposureConfig?: eventConfig;
    extend?: Record<string, any>
}
