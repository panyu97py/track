import type {EventData} from "./eventData";

export interface TrackEventQueueManagerInterface {
    submitEventsQueue: () => void;

    submitEvent: (trackData: EventData) => void;

    batchSubmitEvent: (trackDataList: EventData[]) => void;

}
