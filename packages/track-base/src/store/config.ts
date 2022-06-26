import {injectable} from "inversify";
import {noop} from "../utils";
import type {ConfigStoreInterface, EventDataRequest} from "../interface";

@injectable()
export class ConfigStore implements ConfigStoreInterface {

    private _enableLog: boolean | (() => boolean);

    private _baseInfo: Record<string, any> | (() => Record<string, any>);

    private _commonInfo: Record<string, any> | (() => Record<string, any>);

    private _eventQueueLimitNum: number;

    private _eventQueueMaxRetryTimes: number;

    private _request: EventDataRequest;

    set enableLog(enableLog: boolean | (() => boolean)) {
        this._enableLog = enableLog
    }

    set request(request: EventDataRequest) {
        this._request = request
    }

    set baseInfo(baseInfo: Record<string, any> | (() => Record<string, any>)) {
        this._baseInfo = baseInfo
    }

    set commonInfo(commonInfo: Record<string, any> | (() => Record<string, any>)) {
        this._commonInfo = commonInfo
    }

    set eventQueueLimitNum(eventQueueLimitNum: number) {
        this._eventQueueLimitNum = eventQueueLimitNum
    }

    set eventQueueMaxRetryTimes(eventQueueMaxRetryTimes: number) {
        this._eventQueueMaxRetryTimes = eventQueueMaxRetryTimes
    }

    get enableLog(): boolean {
        if (typeof this._enableLog === 'function') return this._enableLog()
        return this._enableLog
    }

    get request(): EventDataRequest {
        return this._request || noop
    }

    get baseInfo(): Record<string, any> {
        if (typeof this._baseInfo === 'function') return this._baseInfo()
        return this._baseInfo
    }

    get commonInfo(): Record<string, any> {
        if (typeof this._commonInfo === 'function') return this._commonInfo()
        return this._commonInfo
    }

    get eventQueueLimitNum(): number {
        return this._eventQueueLimitNum
    }

    get eventQueueMaxRetryTimes(): number {
        return this._eventQueueMaxRetryTimes
    }

}
