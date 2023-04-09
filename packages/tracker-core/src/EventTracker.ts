import { EventDataProcessType, HookNames, BaseEventConfig } from './constants'
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
  private eventDateQueue: EventDataQueue

  constructor () {
    hooks.tap(HookNames.GET_CUR_PAGE_PATH, () => this.curPagePath)
    hooks.tap(HookNames.EVENT_ON_TRIGGER, this.eventTrigger)
    hooks.tap(HookNames.PAGE_ON_SHOW, this.pageOnShow)
    hooks.tap(HookNames.PAGE_ON_HIDE, this.pageOnHide)
  }

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

  pageOnShow (pagePath: string) {
    this.prePagePath = this.curPagePath

    this.curPagePath = pagePath

    this.eventDataProcess = new EventDataProcess(this.curPagePath, this.prePagePath)

    this.eventDataProcess.targetBeginExposure(BaseEventConfig.PAGE_EXPOSURE_CONFIG)
  }

  pageOnHide () {
    this.eventDataProcess.targetEndExposure(BaseEventConfig.PAGE_EXPOSURE_CONFIG)

    this.eventDateQueue.submitEventsQueue()
  }
}
