import {noop} from "./utils";
import type {TrackEventQueueManagerInterface, EventData} from "./interface";

export class EventQueueManager implements TrackEventQueueManagerInterface {

    limitNum: number;

    maxRetryTimes: number;

    eventsQueue: EventData[];

    failCallback: (trackDataList: EventData[]) => void

    constructor(limitNum = 10, maxRetryTimes = 3, failCallback = noop) {
        this.limitNum = limitNum
        this.maxRetryTimes = maxRetryTimes
        this.failCallback = failCallback
    }

    submitEvent(trackData: EventData): void {
        console.log({trackData})
    }

    batchSubmitEvent(trackDataList: EventData[]): void {
        console.log({trackDataList})
    }

    retrySubmitEventsQueue(): void {
    }


    submitEventsQueue(): void {
        const len = this.eventsQueue.length;

        if (!len) return;

        const events = this.eventsQueue.splice(0, len);

        console.log(events)
    }

}
