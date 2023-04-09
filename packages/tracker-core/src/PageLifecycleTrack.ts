import { EventDataProcessType, HookNames, EventConfig } from './constant'
import { EventDataProcess } from './EventDataProcess'
import { hooks } from './helper'
import { EventDataQueue } from './EventDataQueue'
import { TargetTrackConfig } from './types'

export class PageLifecycleTrack {
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
  }

  pageOnShow (pagePath: string): void {
    // TODO enableLog
    // if (!this._config.enableLog) return

    this.prePagePath = this.curPagePath

    this.curPagePath = pagePath

    this.eventDataProcess = new EventDataProcess(this.curPagePath, this.prePagePath)

    this.eventDataProcess.targetBeginExposure(EventConfig.PAGE_EXPOSURE_CONFIG)

    // TODO EventCenter
    hooks.tap(this.curPagePath, (trackConfig: TargetTrackConfig, type: EventDataProcessType, isImport?: boolean) => {
      switch (type) {
        case EventDataProcessType.BEGIN_EXPOSURE:
          return this.eventDataProcess.targetBeginExposure(trackConfig)

        case EventDataProcessType.END_EXPOSURE:
          return this.eventDataProcess.targetEndExposure(trackConfig, isImport)

        case EventDataProcessType.CLICK:
          return this.eventDataProcess.targetClick(trackConfig, isImport)
      }
    })
  }

  pageOnHide (): void {
    // TODO enableLog
    // if (!this._config.enableLog) return

    // TODO EventCenter off
    // hooks.tap.off(this.curPagePath)

    this.eventDataProcess.targetEndExposure(EventConfig.PAGE_EXPOSURE_CONFIG)

    this.eventDateQueue.submitEventsQueue()
  }
}
