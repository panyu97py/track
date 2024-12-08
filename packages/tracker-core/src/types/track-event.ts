export enum EventType {
  CLICK = 'CLICK',
  EXPOSURE = 'EXPOSURE'
}

export enum BaseEventName {
  PAGE_EXPOSURE = 'PAGE_EXPOSURE'
}

export interface EventConfig {
  eventTargetKey?: string;
  eventClickName?: string;
  eventExposureName?: string;
  canBePageReferrerEvent?: boolean;
  extendData?: Record<string, any>;
}

export interface EventData {
  eventId: string;
  curPagePath?: string;
  referrerEventId?: string;
  referrerPagePath?: string;
  eventType: EventType | string;
  eventName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  extendData?: Record<string, any>;
}
