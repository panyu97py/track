export interface SimpleEventData {
  eventId: string;
  referrerEventId?: string;
  eventType: string;
  eventName: string;
  pageKey: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  extendData: Record<string, any>;
}

export type EventData = Required<SimpleEventData>
