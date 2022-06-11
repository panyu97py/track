import type {TrackEventQueueManagerInterface, eventData} from "./interface";

export class EventQueueManager implements TrackEventQueueManagerInterface {

    limitNum: number;

    eventsQueue: eventData[];

    submitEvent(trackData: eventData): void {
        console.log({trackData})
    }

    batchSubmitEvent(trackDataList: eventData[]): void {
        console.log({trackDataList})
    }


    failCallback(trackDataList: eventData[]): void {
        console.log({trackDataList})
    }

    retrySubmitEventsQueue(): void {
    }


    submitEventsQueue(): void {
    }

}
