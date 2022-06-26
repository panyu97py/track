import {container} from './container'
import {ConfigStore} from './store';
import type {InitBaseTrackOption} from "./interface/initBaseTrack";
import {SERVICE_IDENTIFIER} from "./constants";

export const initBaseTrack = (option: InitBaseTrackOption) => {

    const configStore = container.get<ConfigStore>(SERVICE_IDENTIFIER.CONFIG_STORE)

    configStore.enableLog = option.enableLog

    configStore.baseInfo = option.baseInfo

    configStore.commonInfo = option.commonInfo
}
