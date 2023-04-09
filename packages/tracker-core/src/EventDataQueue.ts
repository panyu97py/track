import { EventData } from './types'
import { hooks } from './helper'
import { HookNames } from './constant'

export class EventDataQueue {
  /**
   * 事件队列长度限制
   */
  readonly queueLineLimit: number

  /**
   * 事件队列
   * @private
   */
  private eventsQueue: EventData[] = []

  constructor (queueLineLimit: number) {
    this.queueLineLimit = queueLineLimit
  }

  /**
   * 提交数据至队列
   * @param eventData
   * @param isImport
   */
  append (eventData: EventData, isImport?: boolean) {
    this.batchAppend([eventData], isImport)
  }

  /**
   * 批量提交数据至队列
   * @param eventDataList
   * @param isImport
   */
  batchAppend (eventDataList: EventData[], isImport?: boolean) {
    eventDataList.map(eventData => hooks.call(HookNames.MODIFY_EVENT_DATA, eventData))
    this.eventsQueue.push(...eventDataList)
    if (isImport || this.eventsQueue.length >= this.queueLineLimit) this.submitEventsQueue()
  }

  /**
   * 提交事件队列
   * @private
   */
  submitEventsQueue () {
    const len = this.eventsQueue.length
    if (!len) return
    const eventDataList = this.eventsQueue.splice(0, len)
    hooks.call(HookNames.SUBMIT_EVENTS_QUEUE, eventDataList)
  }
}
