export interface SimpleEventData {
    eventId: string;
    eventType: string;
    eventName: string;
    startTime: number;
    referrerId?: string;
    endTime?: number;
    duration?: number;
    extendData: Record<string, any>;
}

export type FiledlEventIdSimpleEventData = SimpleEventData & { referrerId: string }

export type EventData = Required<SimpleEventData>
