export interface SimpleEventData {
    eventId: string;
    referrerId?: string;
    eventType: string;
    eventName: string;
    startTime?: number;
    endTime?: number;
    duration?: number;
    extends?: Record<string, any>;
}

export interface EventData {
    eventId: string;
    referrerId: string;
    eventType: string;
    eventName: string;
    startTime: number;
    endTime: number;
    duration: number;
    extends: Record<string, any>;
}
