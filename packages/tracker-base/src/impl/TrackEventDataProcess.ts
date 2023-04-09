import { inject, injectable } from 'inversify'
import { generateUUID } from '../utils'
import { TrackEventQueueManager } from './TrackEventQueueManager'
import { EVENT_TYPE, DEFAULT_TRACK_EVENT_NAME, ERROR_MSG, SERVICE_IDENTIFIER } from '../constants'
import type {
  EventConfig,
  EventData,
  EventType,
  SimpleEventData,
  TargetTrackConfig,
  TrackEventDataProcessInstance,
  FilledEventIdSimpleEventData
} from '../interface'
import { CommonStore } from '../store'

@injectable()
export class TrackEventDataProcess implements TrackEventDataProcessInstance {
  /**
   * 事件队列
   * @param trackData
   */
  @inject(SERVICE_IDENTIFIER.TRACK_EVENT_QUEUE_MANAGER)
  private _trackEventQueueManager: TrackEventQueueManager

  /**
   * 公共 store
   * @private
   */
  @inject(SERVICE_IDENTIFIER.COMMON_STORE)
  private _commonStore: CommonStore

  /**
   * 点击事件数据列表
   * @desc 保存当前页面所有点击事件
   */
  private _clickEventDataMap: Map<string, FilledEventIdSimpleEventData> = new Map()

  /**
   * 曝光事件数据列表
   * @desc 仅保存当前页面可视元素
   */
  private _exposureEventDataMap: Map<string, FilledEventIdSimpleEventData> = new Map()

  /**
   * 填充事件来源 id
   * @param trackData
   * @param config
   */
  fillReferrerId (trackData: SimpleEventData, config: EventConfig): FilledEventIdSimpleEventData {
    const {
      originEventType = EVENT_TYPE.EXPOSURE,
      originEventName = DEFAULT_TRACK_EVENT_NAME.PAGE_EXPOSURE,
      relevanceKey
    } = config

    const originEventKey = this.generateEventKey({
      eventType: originEventType,
      eventName: originEventName,
      relevanceKey
    }, trackData.extendData)

    const originEvent = (() => {
      if (trackData.eventName === DEFAULT_TRACK_EVENT_NAME.PAGE_EXPOSURE) return this._commonStore.currentPageReferrerEventData
      switch (originEventType) {
        case EVENT_TYPE.EXPOSURE:
          return this._exposureEventDataMap.get(originEventKey)
        case EVENT_TYPE.CLICK:
          return this._clickEventDataMap.get(originEventKey)
        default:
          throw ERROR_MSG.UNKNOWN_EVENT_TYPE
      }
    })()

    const { eventId: referrerId = '' } = originEvent || {}

    return { referrerId, ...trackData }
  }

  /**
   * 填充事件结束时间
   * @param trackData
   * @param type
   */
  fillEndTime (trackData: FilledEventIdSimpleEventData, type: EventType): EventData {
    if (type === EVENT_TYPE.CLICK) {
      return {
        ...trackData,
        endTime: trackData.startTime,
        duration: 0
      }
    }

    const endTime = new Date().getTime()

    return {
      ...trackData,
      endTime,
      duration: endTime - trackData.startTime
    }
  }

  /**
   * 获取事件配置
   * @param trackConfig
   * @param type
   */
  getEventConfig (trackConfig: TargetTrackConfig, type: EventType): EventConfig {
    const eventConfig = (() => {
      switch (type) {
        case EVENT_TYPE.CLICK:
          return trackConfig.eventClickConfig
        case EVENT_TYPE.EXPOSURE:
          return trackConfig.eventExposureConfig
        default:
          throw ERROR_MSG.UNKNOWN_EVENT_TYPE
      }
    })()

    if (!eventConfig) throw ERROR_MSG.EVENT_CONFIG_IS_NULL

    return eventConfig
  }

  /**
   * 生成事件唯一标识
   * @param config
   * @param extendData
   */
  generateEventKey (config: EventConfig, extendData?: Record<string, any>): string {
    const {
      eventType,
      eventName,
      relevanceKey
    } = config

    const baseEventKey = `${eventType}-${eventName}`

    if (!(extendData && relevanceKey && extendData[relevanceKey])) return baseEventKey

    return `${baseEventKey}-${extendData[relevanceKey]}`
  }

  /**
   * 生成事件数据
   * @param config
   * @param extendData
   */
  generateEventData (config: EventConfig, extendData?: Record<string, any>): FilledEventIdSimpleEventData {
    const {
      eventType,
      eventName
    } = config

    const eventId = generateUUID()

    const startTime = new Date().getTime()

    const pageKey = this._commonStore.currentPageKey

    const simpleEvent = {
      eventId,
      eventType,
      eventName,
      pageKey,
      extendData: extendData || {},
      startTime
    }

    return this.fillReferrerId(simpleEvent, config)
  }

  /**
   * 目标元素点击
   * @param trackConfig
   * @param isImport
   */
  targetClick (trackConfig: TargetTrackConfig, isImport?: boolean): void {
    const eventConfig = this.getEventConfig(trackConfig, EVENT_TYPE.CLICK)

    const simpleEventData = this.generateEventData(eventConfig, trackConfig.extendData)

    const eventData = this.fillEndTime(simpleEventData, EVENT_TYPE.CLICK)

    const eventKey = this.generateEventKey(eventConfig, trackConfig.extendData)

    this._clickEventDataMap.set(eventKey, eventData)

    this._trackEventQueueManager.submitEvent(eventData, isImport)

    if (eventConfig.canBePageReferrerEvent) this._commonStore.setCurrentPageReferrerEventData(eventData)
  }

  /**
   * 目标元素开始曝光
   * @param trackConfig
   */
  targetBeginExposure (trackConfig: TargetTrackConfig): void {
    const eventConfig = this.getEventConfig(trackConfig, EVENT_TYPE.EXPOSURE)

    const eventData = this.generateEventData(eventConfig, trackConfig.extendData)

    const eventKey = this.generateEventKey(eventConfig, trackConfig.extendData)

    this._exposureEventDataMap.set(eventKey, eventData)
  }

  /**
   * 目标元素停止曝光
   * @param trackConfig
   * @param isImport
   */
  targetEndExposure (trackConfig: TargetTrackConfig, isImport?: boolean): void {
    const eventConfig = this.getEventConfig(trackConfig, EVENT_TYPE.EXPOSURE)

    const eventKey = this.generateEventKey(eventConfig, trackConfig.extendData)

    const simpleEvent = this._exposureEventDataMap.get(eventKey) || this.generateEventData(eventConfig, trackConfig.extendData)

    const eventData = this.fillEndTime(simpleEvent, EVENT_TYPE.EXPOSURE)

    this._trackEventQueueManager.submitEvent(eventData, isImport)

    this._exposureEventDataMap.delete(eventKey)

    if (eventConfig.canBePageReferrerEvent) this._commonStore.setCurrentPageReferrerEventData(eventData)
  }
}
