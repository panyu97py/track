import type {eventData} from "./eventData";

export interface TrackEventQueueManagerInterface {
    limitNum: number;

    eventsQueue: eventData[];

    submitEventsQueue: () => void;

    retrySubmitEventsQueue: () => void;

    submitEvent: (trackData: eventData) => void;

    batchSubmitEvent: (trackDataList: eventData[]) => void;

    failCallback: (trackDataList: eventData[]) => void;
}
