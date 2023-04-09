import { HookCallback, TrackerBaseConfig } from './types'
import { EventTracker } from './EventTracker'
import { hooks } from './helper'
import { BaseHookName } from './constants'

class TrackerCore {
  /**
   * 基础配置
   */
  private baseConfig: TrackerBaseConfig

  /**
   * 事件跟踪器
   * @private
   */
  private eventTracker: EventTracker

  /**
   * 初始化
   * @param config
   */
  init (config: TrackerBaseConfig) {
    this.baseConfig = config
    this.eventTracker = new EventTracker()
    hooks.tap(BaseHookName.GET_TRACKER_CONFIG, () => this.baseConfig)
  }

  /**
   * 用于事件监听
   * @param name
   * @param callback
   */
  tap (name: string, callback: HookCallback) {
    hooks.tap(name, callback)
    return this
  }
}

export const tracker = new TrackerCore()
