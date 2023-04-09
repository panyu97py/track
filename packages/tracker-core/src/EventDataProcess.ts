import { generateUUID, hooks } from './helper'
import { EventType, BaseEventName, ErrorMsg, BaseHookName } from './constants'
import type {
  EventConfig,
  EventData,
  SimpleEventData,
  TargetTrackConfig,
  FilledEventIdSimpleEventData
} from './types'

export class EventDataProcess {
  /**
   * 当前页面的key
   */
  readonly curPagePath: string

  /**
   * 上一个页面的key
   */
  readonly prePagePath: string

  /**
   * 默认来源事件
   */
  readonly defaultReferrerEventData: FilledEventIdSimpleEventData

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

  constructor (curPagePath: string, prePagePath: string) {
    this.curPagePath = curPagePath
    this.prePagePath = prePagePath
    this.defaultReferrerEventData = hooks.call(BaseHookName.GET_CUR_PAGE_DEFAULT_REFERRER_EVENT_DATA)
  }

  /**
   * 填充事件来源 id
   * @param trackData
   * @param config
   */
  private fillReferrerId (trackData: SimpleEventData, config: EventConfig): FilledEventIdSimpleEventData {
    const {
      originEventType = EventType.EXPOSURE,
      originEventName = BaseEventName.PAGE_EXPOSURE,
      relevanceKey
    } = config

    const originEventKey = this.generateEventKey({
      eventType: originEventType,
      eventName: originEventName,
      relevanceKey
    }, trackData.extendData)

    const originEvent = (() => {
      if (trackData.eventName === BaseEventName.PAGE_EXPOSURE) return this.defaultReferrerEventData
      switch (originEventType) {
        case EventType.EXPOSURE:
          return this._exposureEventDataMap.get(originEventKey)
        case EventType.CLICK:
          return this._clickEventDataMap.get(originEventKey)
        default:
          throw ErrorMsg.UNKNOWN_EVENT_TYPE
      }
    })()

    const { eventId: referrerEventId = '' } = originEvent || {}

    return { referrerEventId, ...trackData }
  }

  /**
   * 填充事件结束时间
   * @param trackData
   * @param type
   */
  private fillEndTime (trackData: FilledEventIdSimpleEventData, type: EventType): EventData {
    if (type === EventType.CLICK) {
      return {
        ...trackData,
        endTime: trackData.startTime,
        duration: 0
      }
    }

    const endTime = new Date().getTime()

    const duration = endTime - trackData.startTime

    return {
      ...trackData,
      endTime,
      duration
    }
  }

  /**
   * 获取事件配置
   * @param trackConfig
   * @param type
   */
  private getEventConfig (trackConfig: TargetTrackConfig, type: EventType): EventConfig {
    const eventConfig = (() => {
      switch (type) {
        case EventType.CLICK:
          return trackConfig.eventClickConfig
        case EventType.EXPOSURE:
          return trackConfig.eventExposureConfig
        default:
          throw ErrorMsg.UNKNOWN_EVENT_TYPE
      }
    })()

    if (!eventConfig) throw ErrorMsg.EVENT_CONFIG_IS_EMPTY

    return eventConfig
  }

  /**
   * 生成事件唯一标识
   * @param config
   * @param extendData
   */
  private generateEventKey (config: EventConfig, extendData?: Record<string, any>): string {
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
  private generateEventData (config: EventConfig, extendData?: Record<string, any>): FilledEventIdSimpleEventData {
    const {
      eventType,
      eventName
    } = config

    const eventId = generateUUID()

    const startTime = new Date().getTime()

    const {
      curPagePath,
      prePagePath
    } = this

    const simpleEvent: SimpleEventData = {
      eventId,
      eventType,
      eventName,
      curPagePath,
      prePagePath,
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
    const eventConfig = this.getEventConfig(trackConfig, EventType.CLICK)

    const simpleEventData = this.generateEventData(eventConfig, trackConfig.extendData)

    const eventData = this.fillEndTime(simpleEventData, EventType.CLICK)

    const eventKey = this.generateEventKey(eventConfig, trackConfig.extendData)

    this._clickEventDataMap.set(eventKey, eventData)

    hooks.call(BaseHookName.APPEND_EVENT_DATA_TO_QUEUE, eventData, isImport)

    if (eventConfig.canBePageReferrerEvent) hooks.call(BaseHookName.SET_NEXT_PAGE_DEFAULT_REFERRER_EVENT_DATA, eventData)
  }

  /**
   * 目标元素开始曝光
   * @param trackConfig
   */
  targetBeginExposure (trackConfig: TargetTrackConfig): void {
    const eventConfig = this.getEventConfig(trackConfig, EventType.EXPOSURE)

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
    const eventConfig = this.getEventConfig(trackConfig, EventType.EXPOSURE)

    const eventKey = this.generateEventKey(eventConfig, trackConfig.extendData)

    const simpleEvent = this._exposureEventDataMap.get(eventKey) || this.generateEventData(eventConfig, trackConfig.extendData)

    const eventData = this.fillEndTime(simpleEvent, EventType.EXPOSURE)

    hooks.call(BaseHookName.APPEND_EVENT_DATA_TO_QUEUE, eventData, isImport)

    this._exposureEventDataMap.delete(eventKey)

    if (eventConfig.canBePageReferrerEvent) hooks.call(BaseHookName.SET_NEXT_PAGE_DEFAULT_REFERRER_EVENT_DATA, eventData)
  }
}
