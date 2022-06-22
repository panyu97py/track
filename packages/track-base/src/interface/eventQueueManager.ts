import type {EventData} from "./eventData";

export interface TrackEventQueueManagerInterface {
    limitNum: number;

    maxRetryTimes: number;

    eventsQueue: EventData[];

    submitEventsQueue: () => void;

    retrySubmitEventsQueue: () => void;

    submitEvent: (trackData: EventData) => void;

    batchSubmitEvent: (trackDataList: EventData[]) => void;

    failCallback: (trackDataList: EventData[]) => void;
}
