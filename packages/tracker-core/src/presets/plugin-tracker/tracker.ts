import { BaseEventName, EventConfig, EventData, EventType } from './types'
import { generateUUIDv4 } from '../../helper'

type OutputEventData = (eventData: EventData) => void

export class Tracker {
  /**
   * 实例
   */
  private static tracker: Tracker

  /**
   * 输出埋点数据的回调函数
   */
  private outputEventData: OutputEventData

  /**
   * 默认来源事件Id
   */
  private defaultReferrerEventId: string

  /**
   * 上一个页面路径
   */
  private prePagePath: string

  /**
   * 当前页面路径
   */
  private curPagePath: string

  /**
   * 点击事件数据列表
   * @desc 保存当前页面所有点击事件
   */
  private clickEventIdMap: Map<string, string> = new Map()

  /**
   * 曝光事件数据列表
   * @desc 仅保存当前页面可视元素
   */
  private exposureEventDataMap: Map<string, EventData> = new Map()

  public static getInstance () {
    if (!this.tracker) {
      this.tracker = new Tracker()
    }
    return this.tracker
  }

  /**
   * 生成事件唯一标识
   * @param config
   * @param eventType
   */
  private generateEventKey (config: EventConfig, eventType: EventType): string {
    const { eventClickName, eventExposureName, relevanceKey, extendData } = config

    const eventName = (() => {
      if (eventType === EventType.CLICK && eventClickName) return eventClickName
      if (eventType === EventType.EXPOSURE && eventExposureName) return eventExposureName
      throw new Error('unknown event type')
    })()

    const baseEventKey = `${eventType}-${eventName}`

    if (!(extendData && relevanceKey && extendData[relevanceKey])) return baseEventKey

    return `${baseEventKey}-${extendData[relevanceKey]}`
  }

  private generateTargetClickEventData (eventConfig: EventConfig): EventData {
    const { eventClickName: eventName, extendData } = eventConfig
    const { prePagePath, curPagePath } = this
    const eventId = generateUUIDv4()
    const eventType = EventType.CLICK
    const originEventKey = this.generateEventKey(eventConfig, EventType.EXPOSURE)
    const referrerEventId = this.exposureEventDataMap.get(originEventKey)?.eventId || this.defaultReferrerEventId
    if (!eventName) throw new Error('eventClickName is empty')
    const timeInfo = { startTime: Date.now(), endTime: Date.now() }
    return { eventId, referrerEventId, extendData, prePagePath, curPagePath, eventType, eventName, ...timeInfo }
  }

  private generateTargetExposureEventData (eventConfig: EventConfig): EventData {
    const { eventExposureName: eventName, extendData } = eventConfig
    const { prePagePath, curPagePath, defaultReferrerEventId: referrerEventId } = this
    const eventId = generateUUIDv4()
    const eventType = EventType.EXPOSURE
    if (!eventName) throw new Error('eventExposureName is empty')
    const timeInfo = { startTime: Date.now() }
    return { eventId, referrerEventId, extendData, prePagePath, curPagePath, eventType, eventName, ...timeInfo }
  }

  private generatePageExposureEventData (curPagePath:string): EventData {
    const eventId = generateUUIDv4()
    const eventType = EventType.EXPOSURE
    const eventName = BaseEventName.PAGE_EXPOSURE
    const { curPagePath: prePagePath, defaultReferrerEventId: referrerEventId } = this
    const timeInfo = { startTime: Date.now() }
    return { eventId, referrerEventId, prePagePath, curPagePath, eventType, eventName, ...timeInfo }
  }

  public targetClick (eventConfig: EventConfig) {
    const { canBePageReferrerEvent } = eventConfig
    const eventKey = this.generateEventKey(eventConfig, EventType.CLICK)
    const tempEventData = this.generateTargetClickEventData(eventConfig)
    if (canBePageReferrerEvent) { this.defaultReferrerEventId = tempEventData.eventId }
    this.clickEventIdMap.set(eventKey, tempEventData.eventId)
    this.outputEventData(tempEventData)
  }

  public targetBeginExposure (eventConfig: EventConfig) {
    const eventData = this.generateTargetExposureEventData(eventConfig)
    const eventKey = this.generateEventKey(eventConfig, EventType.EXPOSURE)
    this.exposureEventDataMap.set(eventKey, eventData)
  }

  public targetEndExposure (eventConfig: EventConfig) {
    const eventKey = this.generateEventKey(eventConfig, EventType.EXPOSURE)
    const tempEventData = (() => {
      const result = this.exposureEventDataMap.get(eventKey)
      if (!result) return this.generateTargetExposureEventData(eventConfig)
      return result
    })()
    const endTime = new Date().getTime()
    const duration = endTime - tempEventData.startTime
    const finalEventData = { ...tempEventData, endTime, duration }
    this.exposureEventDataMap.delete(eventKey)
    this.outputEventData(finalEventData)
  }

  public pageBeginExposure (pagePath: string) {
    const eventConfig = { eventExposureName: BaseEventName.PAGE_EXPOSURE }
    const eventKey = this.generateEventKey(eventConfig, EventType.EXPOSURE)
    const tempEventData = this.generatePageExposureEventData(pagePath)
    this.exposureEventDataMap.set(eventKey, tempEventData)
    this.defaultReferrerEventId = tempEventData.eventId
    this.prePagePath = this.curPagePath
    this.curPagePath = pagePath
  }

  public pageEndExposure () {
    const eventDataList = Array.from(this.exposureEventDataMap.values())
    const endTime = Date.now()
    eventDataList.forEach((eventData) => {
      const finalEventData = { ...eventData, endTime }
      this.outputEventData(finalEventData)
    })
    this.exposureEventDataMap.clear()
    this.clickEventIdMap.clear()
  }

  public registerCallback (callback: OutputEventData) {
    this.outputEventData = callback
  }
}
