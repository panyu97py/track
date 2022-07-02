import { EventDataRequest } from './store'

export interface InitBaseTrackOption {

    enableLog: boolean | (() => boolean);

    commonInfo: Record<string, any> | (() => Record<string, any>);

    baseInfo: Record<string, any> | (() => Record<string, any>);

    request: EventDataRequest;

    eventQueueLimitNum: number;

    eventQueueMaxRetryTimes: number;

}
