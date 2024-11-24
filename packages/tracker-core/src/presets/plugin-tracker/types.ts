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
  canBePageReferrerEvent?: boolean
  relevanceKey?: string;
  extendData?: Record<string, any>;
}

export interface EventData {
  eventId: string;
  referrerEventId?: string;
  eventType: EventType;
  eventName: string;
  curPagePath?: string;
  prePagePath?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  extendData?: Record<string, any>;
}
