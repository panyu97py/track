import { EventDataProcessType, BaseHookName, BaseEventConfig } from './constants'
import { EventDataProcess } from './EventDataProcess'
import { hooks } from './helper'
import { EventDataQueue } from './EventDataQueue'
import { TargetTrackConfig } from './types'

export class EventTracker {
  /**
   * 当前页面的key
   * @private
   */
  private curPagePath: string

  /**
   * 上一个页面的key
   * @private
   */
  private prePagePath: string

  /**
   * 事件数据处理
   * @private
   */
  private eventDataProcess: EventDataProcess

  /**
   * 事件队列
   * @private
   */
  private eventDataQueue: EventDataQueue

  constructor () {
    this.initEventDataQueue()
    this.initHooks()
  }

  initEventDataQueue () {
    const trackerConfig = hooks.call(BaseHookName.GET_TRACKER_CONFIG)
    const { queueLimit } = trackerConfig
    this.eventDataQueue = new EventDataQueue(queueLimit)
  }

  /**
   * 初始化 hook
   */
  initHooks () {
    hooks.tap(BaseHookName.GET_CUR_PAGE_PATH, () => this.curPagePath)

    hooks.tap(BaseHookName.APPEND_EVENT_DATA_TO_QUEUE, this.eventDataQueue.append)

    hooks.tap(BaseHookName.EVENT_ON_TRIGGER, this.eventTrigger)

    hooks.tap(BaseHookName.PAGE_ON_SHOW, this.pageOnShow)

    hooks.tap(BaseHookName.PAGE_ON_HIDE, this.pageOnHide)
  }

  /**
   * 事件触发
   * @param trackConfig
   * @param type
   * @param isImport
   */
  eventTrigger (trackConfig: TargetTrackConfig, type: EventDataProcessType, isImport?: boolean) {
    switch (type) {
      case EventDataProcessType.BEGIN_EXPOSURE:
        return this.eventDataProcess.targetBeginExposure(trackConfig)

      case EventDataProcessType.END_EXPOSURE:
        return this.eventDataProcess.targetEndExposure(trackConfig, isImport)

      case EventDataProcessType.CLICK:
        return this.eventDataProcess.targetClick(trackConfig, isImport)
    }
  }

  /**
   * 页面曝光
   * @param pagePath
   */
  pageOnShow (pagePath: string) {
    this.prePagePath = this.curPagePath

    this.curPagePath = pagePath

    this.eventDataProcess = new EventDataProcess(this.curPagePath, this.prePagePath)

    this.eventDataProcess.targetBeginExposure(BaseEventConfig.PAGE_EXPOSURE_CONFIG)
  }

  /**
   * 页面隐藏
   */
  pageOnHide () {
    this.eventDataProcess.targetEndExposure(BaseEventConfig.PAGE_EXPOSURE_CONFIG)

    this.eventDataQueue.submitEventsQueue()
  }
}
