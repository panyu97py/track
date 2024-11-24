import { BaseEventName, EventConfig, EventData, EventType } from './types'

const generateUUIDv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: any) => {
    const r = Math.random() * 16 | 0 // 生成一个 0-15 之间的随机整数
    const v = c === 'x' ? r : (r & 0x3 | 0x8) // 'x' 位置随机，'y' 位置符合版本4规范
    return v.toString(16) // 将结果转换成 16 进制字符串
  })
}

type OutputEventData = (eventData: EventData) => void

export class Tracker {
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
      throw new Error('unknown event type')
    })()
    const startTime = Date.now()
    const tempEventData = { eventId, eventName, eventType, startTime, extendData }
    if (eventType === EventType.CLICK) return this.fillEndTime(tempEventData, eventType)
    return tempEventData
  }

  /**
   * 填充事件结束时间
   * @param eventData
   * @param type
   */
  private fillEndTime (eventData: EventData, type: EventType): EventData {
    if (type === EventType.CLICK) return { ...eventData, endTime: eventData.startTime, duration: 0 }

    const endTime = new Date().getTime()

    const duration = endTime - eventData.startTime

    return { ...eventData, endTime, duration }
  }

  private fillReferrerId = (trackData: EventData) => {
    // return trackData
  }

  private fillPageUrl (trackData: EventData) {
    // const { prePagePath, curPagePath } = this
    // return { prePagePath, curPagePath, ...trackData }
  }

  public targetClick (eventConfig: EventConfig) {
    // const { canBePageReferrerEvent } = eventConfig
    // const eventData = this.generateEventData(eventConfig, EventType.CLICK)
    // if (canBePageReferrerEvent) {
    //   this.defaultReferrerEventId = eventData.eventId
    // }
    // this.outputEventData(eventData)
  }

  public targetBeginExposure (eventConfig: EventConfig) {
    // const eventData = this.generateEventData(eventConfig, EventType.EXPOSURE)
    // const eventKey = this.generateEventKey(eventConfig, EventType.EXPOSURE)
    // this.exposureEventDataMap.set(eventKey, eventData)
  }

  public targetEndExposure (eventConfig: EventConfig) {
  }

  public pageBeginExposure (pagePath: string) {
    // 清空上个页面的缓存数据
    this.clickEventDataMap.clear()
    this.exposureEventDataMap.clear()

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
      const eventData = this.fillEndTime(item, EventType.EXPOSURE)
      this.outputEventData(eventData)
    })
  }

  public registerCallback (callback: OutputEventData) {
    this.outputEventData = callback
  }
}
