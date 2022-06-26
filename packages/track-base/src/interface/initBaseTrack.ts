export interface InitBaseTrackOption {

    enableLog: boolean | (() => boolean);

    commonInfo: Record<string, any> | (() => Record<string, any>);

    baseInfo: Record<string, any> | (() => Record<string, any>);

    request: () => void

}
