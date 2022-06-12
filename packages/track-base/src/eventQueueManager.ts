import type {TrackEventQueueManagerInterface, EventData} from "./interface";

export class EventQueueManager implements TrackEventQueueManagerInterface {

    limitNum: number;

    eventsQueue: EventData[];

    submitEvent(trackData: EventData): void {
        console.log({trackData})
    }

    batchSubmitEvent(trackDataList: EventData[]): void {
        console.log({trackDataList})
    }


    failCallback(trackDataList: EventData[]): void {
        console.log({trackDataList})
    }

    retrySubmitEventsQueue(): void {
    }


    submitEventsQueue(): void {
    }

}
