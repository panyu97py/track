// import { BaseEventName, EventConfig, EventData, EventType } from '../../types'
// import { generateUUIDv4 } from '../../helper'
//
// type Callback = (eventData: EventData) => void
//
// export class Tracker {
//   /**
//    * 实例
//    */
//   private static trackerInstance: Tracker
//
//   /**
//    * 输出埋点数据的回调函数
//    */
//   private callback: Callback
//
//   /**
//    * 默认来源事件Id
//    */
//   private defaultReferrerEventId: string
//
//   /**
//    * 上一个页面路径
//    */
//   private prePagePath: string
//
//   /**
//    * 当前页面路径
//    */
//   private curPagePath: string
//
//   /**
//    * 曝光事件数据列表
//    * @desc 仅保存当前页面可视元素
//    */
//   private exposureEventDataMap: Map<string, EventData> = new Map()
//
//   public static getInstance = () => {
//     if (!this.trackerInstance) {
//       this.trackerInstance = new Tracker()
//     }
//     return this.trackerInstance
//   }
//
//   /**
//    * 生成事件唯一标识
//    * @param config
//    */
//   private generateExposureEventKey = (config: EventConfig): string => {
//     const { eventExposureName: eventName, relevanceKey, extendData } = config
//
//     const eventType = EventType.EXPOSURE
//
//     const baseEventKey = `${eventType}-${eventName}`
//
//     if (!(extendData && relevanceKey && extendData[relevanceKey])) return baseEventKey
//
//     return `${baseEventKey}-${extendData[relevanceKey]}`
//   }
//
//   /**
//    * 生成元素点击事件数据
//    * @param eventConfig
//    */
//   private generateTargetClickEventData = (eventConfig: EventConfig): EventData => {
//     const { eventClickName: eventName, extendData } = eventConfig
//     const { prePagePath, curPagePath } = this
//     const eventId = generateUUIDv4()
//     const eventType = EventType.CLICK
//     const originEventKey = this.generateExposureEventKey(eventConfig)
//     const referrerEventId = this.exposureEventDataMap.get(originEventKey)?.eventId || this.defaultReferrerEventId
//     if (!eventName) throw new Error('eventClickName is empty')
//     const timeInfo = { startTime: Date.now(), endTime: Date.now(), duration: 0 }
//     return { eventId, referrerEventId, extendData, prePagePath, curPagePath, eventType, eventName, ...timeInfo }
//   }
//
//   /**
//    * 生成元素曝光事件数据
//    * @param eventConfig
//    */
//   private generateTargetExposureEventData = (eventConfig: EventConfig): EventData => {
//     const { eventExposureName: eventName, extendData } = eventConfig
//     const { prePagePath, curPagePath, defaultReferrerEventId: referrerEventId } = this
//     const eventId = generateUUIDv4()
//     const eventType = EventType.EXPOSURE
//     if (!eventName) throw new Error('eventExposureName is empty')
//     const timeInfo = { startTime: Date.now() }
//     return { eventId, referrerEventId, extendData, prePagePath, curPagePath, eventType, eventName, ...timeInfo }
//   }
//
//   /**
//    * 生成页面曝光事件数据
//    * @param curPagePath
//    * @param extendData
//    */
//   private generatePageExposureEventData = (curPagePath:string, extendData:Record<string, any>): EventData => {
//     const eventId = generateUUIDv4()
//     const eventType = EventType.EXPOSURE
//     const eventName = BaseEventName.PAGE_EXPOSURE
//     const { curPagePath: prePagePath, defaultReferrerEventId: referrerEventId } = this
//     const timeInfo = { startTime: Date.now() }
//     return { eventId, referrerEventId, prePagePath, curPagePath, eventType, eventName, extendData, ...timeInfo }
//   }
//
//   /**
//    * 元素点击事件埋点逻辑
//    * @param eventConfig
//    */
//   public targetClick = (eventConfig: EventConfig) => {
//     const { canBePageReferrerEvent } = eventConfig
//     const tempEventData = this.generateTargetClickEventData(eventConfig)
//     if (canBePageReferrerEvent) { this.defaultReferrerEventId = tempEventData.eventId }
//     this.callback(tempEventData)
//   }
//
//   /**
//    * 元素开始曝光事件埋点逻辑
//    * @param eventConfig
//    */
//   public targetBeginExposure = (eventConfig: EventConfig) => {
//     const eventData = this.generateTargetExposureEventData(eventConfig)
//     const eventKey = this.generateExposureEventKey(eventConfig)
//     this.exposureEventDataMap.set(eventKey, eventData)
//   }
//
//   /**
//    * 元素结束曝光事件埋点逻辑
//    * @param eventConfig
//    */
//   public targetEndExposure = (eventConfig: EventConfig) => {
//     const eventKey = this.generateExposureEventKey(eventConfig)
//     const tempEventData = this.exposureEventDataMap.get(eventKey)
//     if (!tempEventData) return // 页面结束曝光时会上报一遍未结束曝光的数据，为避免重复上报这里直接 return
//     const endTime = new Date().getTime()
//     const duration = endTime - tempEventData.startTime
//     const finalEventData = { ...tempEventData, endTime, duration }
//     this.exposureEventDataMap.delete(eventKey)
//     this.callback(finalEventData)
//   }
//
//   /**
//    * 页面开始曝光事件埋点逻辑
//    * @param pagePath
//    * @param params
//    */
//   public pageBeginExposure = (pagePath: string, params:Record<string, any>) => {
//     const eventConfig = { eventExposureName: BaseEventName.PAGE_EXPOSURE, extendData: params }
//     const eventKey = this.generateExposureEventKey(eventConfig)
//     const tempEventData = this.generatePageExposureEventData(pagePath, params)
//     this.exposureEventDataMap.set(eventKey, tempEventData)
//     this.defaultReferrerEventId = tempEventData.eventId
//     this.prePagePath = this.curPagePath
//     this.curPagePath = pagePath
//   }
//
//   /**
//    * 页面结束曝光埋点事件逻辑
//    * @desc 页面结束曝光统一将所有曝光事件数据输出
//    */
//   public pageEndExposure = () => {
//     const eventDataList = Array.from(this.exposureEventDataMap.values())
//     const endTime = Date.now()
//     eventDataList.forEach((eventData) => {
//       const duration = endTime - eventData.startTime
//       const finalEventData = { ...eventData, endTime, duration }
//       this.callback(finalEventData)
//     })
//     this.exposureEventDataMap.clear()
//   }
//
//   /**
//    * 注册输出埋点数据的回调函数
//    * @param callback
//    */
//   public registerCallback = (callback: Callback) => {
//     this.callback = callback
//   }
// }
