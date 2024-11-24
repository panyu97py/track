import { BaseEventName, EventConfig, EventData, EventType } from './types'
import { generateUUIDv4, pipe } from '../../helper'

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
  private clickEventDataMap: Map<string, EventData> = new Map()

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

  private generateEventData (eventConfig: EventConfig, eventType: EventType): EventData {
    const { eventExposureName, eventClickName, extendData = {} } = eventConfig
    const eventId = generateUUIDv4()
    const eventName = (() => {
      if (eventType === EventType.CLICK && eventClickName) return eventClickName
      if (eventType === EventType.EXPOSURE && eventExposureName) return eventExposureName
      throw new Error('unknown event type or event name is empty')
    })()
    const startTime = Date.now()
    const { prePagePath, curPagePath } = this
    const tempEventData = { eventId, eventName, eventType, startTime, extendData }
    if (eventName === BaseEventName.PAGE_EXPOSURE) return tempEventData
    return { ...tempEventData, prePagePath, curPagePath }
  }

  /**
   * 填充事件结束时间
   * @param eventData
   */
  private fillEndTime (eventData: EventData): EventData {
    if (eventData.eventType === EventType.CLICK) return { ...eventData, endTime: eventData.startTime, duration: 0 }

    const endTime = new Date().getTime()

    const duration = endTime - eventData.startTime

    return { ...eventData, endTime, duration }
  }

  private fillReferrerId = (trackData: EventData) => {
    // return trackData
  }

  public targetClick (eventConfig: EventConfig) {
    const { canBePageReferrerEvent } = eventConfig
    const eventKey = this.generateEventKey(eventConfig, EventType.CLICK)
    const tempEventData = this.generateEventData(eventConfig, EventType.CLICK)
    const finalEventData = pipe(this.fillEndTime, this.fillReferrerId)(tempEventData)
    if (canBePageReferrerEvent) { this.defaultReferrerEventId = finalEventData.eventId }
    this.exposureEventDataMap.set(eventKey, finalEventData)
    this.outputEventData(finalEventData)
  }

  public targetBeginExposure (eventConfig: EventConfig) {
    const eventData = this.generateEventData(eventConfig, EventType.EXPOSURE)
    const eventKey = this.generateEventKey(eventConfig, EventType.EXPOSURE)
    this.exposureEventDataMap.set(eventKey, eventData)
  }

  public targetEndExposure (eventConfig: EventConfig) {
    const eventKey = this.generateEventKey(eventConfig, EventType.EXPOSURE)
    const tempEventData = this.exposureEventDataMap.get(eventKey)
    const finalEventData = pipe(this.fillEndTime, this.fillReferrerId)(tempEventData)
    this.exposureEventDataMap.delete(eventKey)
    this.outputEventData(finalEventData)
  }

  public pageBeginExposure (pagePath: string) {
    const eventConfig = { eventExposureName: BaseEventName.PAGE_EXPOSURE }
    const eventKey = this.generateEventKey(eventConfig, EventType.EXPOSURE)
    const tempEventData = this.generateEventData(eventConfig, EventType.CLICK)

    // 补充页面曝光埋点相关信息
    const { curPagePath: prePagePath, defaultReferrerEventId: referrerEventId } = this
    const additionalInfo = { prePagePath, curPagePath: pagePath, referrerEventId }
    this.exposureEventDataMap.set(eventKey, { ...tempEventData, ...additionalInfo })

    // 设置默认事件来源及页面路径信息
    this.defaultReferrerEventId = tempEventData.eventId
    this.prePagePath = this.curPagePath
    this.curPagePath = pagePath
  }

  public pageEndExposure () {
    const eventDataList = Array.from(this.exposureEventDataMap.values())
    eventDataList.forEach((item) => {
      const eventData = this.fillEndTime(item)
      this.outputEventData(eventData)
    })
    this.exposureEventDataMap.clear()
    this.clickEventDataMap.clear()
  }

  public registerCallback (callback: OutputEventData) {
    this.outputEventData = callback
  }
}
