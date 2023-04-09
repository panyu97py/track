import { DEFAULT_EVENT_CENTER_EVENT_NAME, SERVICE_IDENTIFIER } from '../constants'
import { CommonStore } from '../store'
import { container } from '../container'
import { EventCenter, TrackEventQueueManager } from '../impl'
import type { EventData, EventDataProcessType, TargetTrackConfig } from '../interface'

/**
 * 空函数
 */
export const noop = () => {
}

/**
 * 生成 uuid
 * @desc 由于埋点数据，数据量较为庞大可能会出现uuid重复的情况，故而增加时间戳用于降低重复的几率
 */
export const generateUUID = () => {
  const s:any[] = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('') + Date.now().toString(16)
}

/**
 * 提交埋点事件
 * @param trackConfig
 * @param type
 * @param isImport
 */
export const submitTrack = (trackConfig: TargetTrackConfig, type: EventDataProcessType, isImport?: boolean) => {
  const commonStore = container.get<CommonStore>(SERVICE_IDENTIFIER.COMMON_STORE)
  const eventCenter = container.get<EventCenter>(SERVICE_IDENTIFIER.EVENT_CENTER)
  eventCenter.trigger(commonStore.currentPageKey, trackConfig, type, isImport)
}

/**
 * 初始化全局事件队列
 */
export const initGlobalEventQueueManager = () => {
  const trackEventQueueManager = container.get<TrackEventQueueManager>(SERVICE_IDENTIFIER.TRACK_EVENT_QUEUE_MANAGER)
  const eventCenter = container.get<EventCenter>(SERVICE_IDENTIFIER.EVENT_CENTER)
  eventCenter.on(DEFAULT_EVENT_CENTER_EVENT_NAME.GLOBAL_EVENT_LISTENER, (eventData: EventData, isImport?: boolean) => trackEventQueueManager.submitEvent(eventData, isImport))
}

/**
 * 提交事件数据至全局事件队列
 * @param eventData
 * @param isImport
 */
export const submitEventData = (eventData: EventData, isImport?: boolean) => {
  const eventCenter = container.get<EventCenter>(SERVICE_IDENTIFIER.EVENT_CENTER)
  eventCenter.trigger(DEFAULT_EVENT_CENTER_EVENT_NAME.GLOBAL_EVENT_LISTENER, eventData, isImport)
}
