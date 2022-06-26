import {injectable} from "inversify";
import type {ConfigStoreInterface} from "../interface";

@injectable()
export class ConfigStore implements ConfigStoreInterface {

    private _enableLog: boolean | (() => boolean);

    private _baseInfo: Record<string, any> | (() => Record<string, any>);

    private _commonInfo: Record<string, any> | (() => Record<string, any>);

    set enableLog(enableLog: boolean | (() => boolean)) {
        this._enableLog = enableLog
    }

    set baseInfo(baseInfo: Record<string, any> | (() => Record<string, any>)) {
        this._baseInfo = baseInfo
    }

    set commonInfo(commonInfo: Record<string, any> | (() => Record<string, any>)) {
        this._commonInfo = commonInfo
    }

    get enableLog(): boolean {
        if (typeof this._enableLog === 'function') return this._enableLog()
        return this._enableLog
    }

    get baseInfo(): Record<string, any> {
        if (typeof this._baseInfo === 'function') return this._baseInfo()
        return this._baseInfo
    }

    get commonInfo(): Record<string, any> {
        if (typeof this._commonInfo === 'function') return this._commonInfo()
        return this._commonInfo
    }

}
