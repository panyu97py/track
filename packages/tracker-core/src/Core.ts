import { HookCallback, Preset, PresetContext, Config } from './types'
import { EventTracker } from './EventTracker'
import { hooks } from './helper'
import { BaseHookName } from './constants'

class TrackerCore {
  /**
   * 基础配置
   */
  private config: Config

  /**
   * 事件跟踪器
   * @private
   */
  private eventTracker: EventTracker

  /**
   * 初始化
   * @param config
   */
  init (config: Config) {
    this.config = config
    this.eventTracker = new EventTracker()
    hooks.tap(BaseHookName.GET_TRACKER_CONFIG, () => this.config)
    this.applyPresets(config.presets)
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

  /**
   * 初始化 preset
   * @param presets
   * @private
   */
  private applyPresets (presets: Preset[]) {
    const { tap } = this
    const context: PresetContext = { tap }
    presets.forEach(preset => preset(context))
  }
}

export const tracker = new TrackerCore()
