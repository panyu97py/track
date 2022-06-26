import {injectable} from "inversify";
import type {EventData, CommonStoreInterface} from "../interface";

@injectable()
export class CommonStore implements CommonStoreInterface {

    private _currentPageKey: string;

    private _currentPageReferrerEventData: EventData;

    get currentPageKey(): string {
        return this._currentPageKey;
    }

    get currentPageReferrerEventData(): EventData {
        return this._currentPageReferrerEventData;
    }

    setCurrentPageKey(currentPageKey: string): void {
        this._currentPageKey = currentPageKey
    }

    setCurrentPageReferrerEventData(currentPageReferrerEventData: EventData): void {
        this._currentPageReferrerEventData = currentPageReferrerEventData
    }

}
