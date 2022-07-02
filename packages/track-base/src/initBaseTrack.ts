import { container } from './container'
import { ConfigStore } from './store'
import { SERVICE_IDENTIFIER } from './constants'
import { initGlobalEventQueueManager, noop } from './utils'
import type { InitBaseTrackOption } from './interface/initBaseTrack'

/**
 * 初始化基础埋点配置
 * @param option
 */
export const initBaseTrack = (option: InitBaseTrackOption) => {
  const { enableLog = true, request = noop, baseInfo = {}, commonInfo = {} } = option

  const configStore = container.get<ConfigStore>(SERVICE_IDENTIFIER.CONFIG_STORE)

  configStore.setEnableLog(enableLog)

  configStore.setRequest(request)

  configStore.setBaseInfo(baseInfo)

  configStore.setCommonInfo(commonInfo)

  initGlobalEventQueueManager()
}
