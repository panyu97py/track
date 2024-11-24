export enum EventType {
  CLICK = 'CLICK',
  EXPOSURE = 'EXPOSURE'
}

export enum EventDataProcessType {
  CLICK = 'CLICK',
  BEGIN_EXPOSURE = 'BEGIN_EXPOSURE',
  END_EXPOSURE = 'END_EXPOSURE'
}

export enum BaseEventName {
  PAGE_EXPOSURE = 'PAGE_EXPOSURE'
}

export interface EventConfig {
  eventClickName?: string;
  eventExposureName?: string;
  originEventType?: EventType;
  originEventName?: string;
  canBePageReferrerEvent?: boolean
  relevanceKey?: string;
  extendData?: Record<string, any>;
}

export interface SimpleEventData {
  eventId: string;
  referrerEventId?: string;
  eventType: string;
  eventName: string;
  curPagePath: string;
  prePagePath: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  extendData: Record<string, any>;
}

export type EventData = Required<SimpleEventData>
