import { EventDataProcessType, BaseHookName, BaseEventConfig } from './constants'
import { EventDataProcess } from './EventDataProcess'
import { hooks } from './helper'
import { EventDataQueue } from './EventDataQueue'
import { EventData, TargetTrackConfig, TrackerBaseConfig } from './types'

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

  /**
   * 埋点配置
   * @private
   */
  private get trackerConfig (): TrackerBaseConfig {
    return hooks.call(BaseHookName.GET_TRACKER_CONFIG)
  }

  constructor () {
    this.initEventDataQueue()
    this.initHooks()
  }

  /**
   * 初始化事件队列
   */
  private initEventDataQueue () {
    const { queueLimit } = this.trackerConfig
    this.eventDataQueue = new EventDataQueue(queueLimit)
  }

  /**
   * 初始化 hook
   */
  private initHooks () {
    hooks.tap(BaseHookName.GET_CUR_PAGE_PATH, () => this.curPagePath)

    hooks.tap(BaseHookName.APPEND_EVENT_DATA_TO_QUEUE, this.eventDataQueue.append)

    hooks.tap(BaseHookName.SUBMIT_EVENTS_DATA_QUEUE, this.submitTrackData)

    hooks.tap(BaseHookName.EVENT_ON_TRIGGER, this.eventTrigger)

    hooks.tap(BaseHookName.PAGE_ON_SHOW, this.pageOnShow)

    hooks.tap(BaseHookName.PAGE_ON_HIDE, this.pageOnHide)
  }

  /**
   * 提交埋点数据
   * @param eventDataList
   * @private
   */
  private submitTrackData (eventDataList: EventData[]) {
    const { commonInfo: tempCommonInfo } = this.trackerConfig
    const commonInfo = typeof tempCommonInfo === 'function' ? tempCommonInfo() : tempCommonInfo
    hooks.call(BaseHookName.SUBMIT_TRACK_DATA, {
      commonInfo,
      eventDataList
    })
  }

  /**
   * 事件触发
   * @param trackConfig
   * @param type
   * @param isImport
   */
  private eventTrigger (trackConfig: TargetTrackConfig, type: EventDataProcessType, isImport?: boolean) {
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
  private pageOnShow (pagePath: string) {
    this.prePagePath = this.curPagePath

    this.curPagePath = pagePath

    this.eventDataProcess = new EventDataProcess(this.curPagePath, this.prePagePath)

    this.eventDataProcess.targetBeginExposure(BaseEventConfig.PAGE_EXPOSURE_CONFIG)
  }

  /**
   * 页面隐藏
   */
  private pageOnHide () {
    this.eventDataProcess.targetEndExposure(BaseEventConfig.PAGE_EXPOSURE_CONFIG)

    this.eventDataQueue.submitQueue()
  }
}
