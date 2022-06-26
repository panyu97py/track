export interface ConfigStoreInterface {

    set enableLog(enable: boolean | (() => boolean));

    set baseInfo(baseInfo: Record<string, any> | (() => Record<string, any>));

    set commonInfo(commonInfo: Record<string, any> | (() => Record<string, any>));

    get enableLog(): boolean;

    get baseInfo(): Record<string, any>;

    get commonInfo(): Record<string, any>;

}
