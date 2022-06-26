import {injectable} from "inversify";
import type {EventData, EventStoreInterface} from "../interface";

@injectable()
export class EventStore implements EventStoreInterface {

    private _currentPageKey: string;

    private _referrerEventData: EventData;

    get currentPageKey(): string {
        return this._currentPageKey;
    }

    get referrerEventData(): EventData {
        return this._referrerEventData;
    }

    setCurrentPageKey(currentPageKey: string): void {
        this._currentPageKey = currentPageKey
    }

    setReferrerEventData(referrerEventData: EventData): void {
        this._referrerEventData = referrerEventData
    }

}
