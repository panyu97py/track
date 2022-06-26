export interface requestParams {

}

export type EventDataRequest = (params: requestParams) => void;

export interface ConfigStoreInterface {

    set enableLog(enable: boolean | (() => boolean));

    set request(request: EventDataRequest)

    set baseInfo(baseInfo: Record<string, any> | (() => Record<string, any>));

    set commonInfo(commonInfo: Record<string, any> | (() => Record<string, any>));

    set eventQueueLimitNum(eventQueueLimitNum: number);

    set eventQueueMaxRetryTimes(eventQueueMaxRetryTimes:number);

    get enableLog(): boolean;

    get request(): EventDataRequest;

    get baseInfo(): Record<string, any>;

    get commonInfo(): Record<string, any>;

    get eventQueueLimitNum(): number;

    get eventQueueMaxRetryTimes():number;

}
