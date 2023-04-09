import { inject, injectable } from 'inversify'
import { ConfigStore } from '../store'
import { SERVICE_IDENTIFIER } from '../constants'
import type { TrackEventQueueManagerInterface, EventData } from '../interface'

@injectable()
export class TrackEventQueueManager implements TrackEventQueueManagerInterface {
  /**
   * 配置
   * @private
   */
  @inject(SERVICE_IDENTIFIER.CONFIG_STORE)
  private _config: ConfigStore

  /**
   * 事件队列
   * @private
   */
  private _eventsQueue: EventData[] = []

  /**
   * 提交事件
   * @param trackData
   * @param isImport
   */
  submitEvent (trackData: EventData, isImport?: boolean): void {
    this._eventsQueue.push(trackData)

    if (isImport || this._eventsQueue.length >= this._config.eventQueueLimitNum) this.submitEventsQueue()
  }

  /**
   * 批量提交事件
   * @param trackDataList
   * @param isImport
   */
  batchSubmitEvent (trackDataList: EventData[], isImport?: boolean): void {
    this._eventsQueue.push(...trackDataList)

    if (isImport || this._eventsQueue.length >= this._config.eventQueueLimitNum) this.submitEventsQueue()
  }

  /**
   * 提交事件队列
   */
  submitEventsQueue (): void {
    const len = this._eventsQueue.length

    if (!len) return

    const events = this._eventsQueue.splice(0, len)

    const {
      baseInfo,
      commonInfo
    } = this._config

    this._config.request({
      events,
      baseInfo,
      commonInfo
    })
  }
}
