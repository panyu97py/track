import type { EventData } from './eventData'

export interface TrackEventQueueManagerInterface {
  submitEventsQueue: () => void;

  submitEvent: (trackData: EventData, isImport?: boolean) => void;

  batchSubmitEvent: (trackDataList: EventData[], isImport?: boolean) => void;

}
