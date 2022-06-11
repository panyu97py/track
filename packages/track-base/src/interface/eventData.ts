export interface simpleEventData {
    eventId: string;
    referrerId?: string;
    eventType: string;
    eventName: string;
    startTime?: number;
    endTime?: number;
    duration?: number;
    extends?: Record<string, any>;
}

export interface eventData {
    eventId: string;
    referrerId: string;
    eventType: string;
    eventName: string;
    startTime: number;
    endTime: number;
    duration: number;
    extends: Record<string, any>;
}
