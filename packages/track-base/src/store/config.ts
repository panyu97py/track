import {injectable} from "inversify";
import type {ConfigStoreInterface, EventDataRequest} from "../interface";

@injectable()
export class ConfigStore implements ConfigStoreInterface {

    private _enableLog: boolean | (() => boolean);

    private _baseInfo: Record<string, any> | (() => Record<string, any>);

    private _commonInfo: Record<string, any> | (() => Record<string, any>);

    private _eventQueueLimitNum: number;

    private _eventQueueMaxRetryTimes: number;

    private _request: EventDataRequest;

    get enableLog(): boolean {
        if (typeof this._enableLog === 'function') return this._enableLog()
        return this._enableLog
    }

    get request(): EventDataRequest {
        return this._request
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

    setEnableLog(enableLog: boolean | (() => boolean)) {
        this._enableLog = enableLog
    }

    setRequest(request: EventDataRequest) {
        this._request = request
    }

    setBaseInfo(baseInfo: Record<string, any> | (() => Record<string, any>)) {
        this._baseInfo = baseInfo
    }

    setCommonInfo(commonInfo: Record<string, any> | (() => Record<string, any>)) {
        this._commonInfo = commonInfo
    }

    setEventQueueLimitNum(eventQueueLimitNum: number) {
        this._eventQueueLimitNum = eventQueueLimitNum
    }

    setEventQueueMaxRetryTimes(eventQueueMaxRetryTimes: number) {
        this._eventQueueMaxRetryTimes = eventQueueMaxRetryTimes
    }

}
