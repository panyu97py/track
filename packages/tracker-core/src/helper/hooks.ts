import { HookCallback, TrackerHookItem } from '../types'
import { EventCenter } from './eventCenter'
import { ErrorMsg } from '../constants'
import { HOOK_CALLBACK_IS_EMPTY } from '../constants/ErrorMsg'

class TrackerHooks extends EventCenter {
  /**
   * hook 回调列表
   * @private
   */
  private hooks: TrackerHookItem[] = []

  /**
   * 注册 Hook
   * @param name
   * @param callback
   */
  tap (name: string, callback: HookCallback) {
    if (!name) throw ErrorMsg.HOOK_NAME_IS_EMPTY
    if (typeof callback !== 'function') throw ErrorMsg.HOOK_CALLBACK_IS_EMPTY
    this.hooks.push({
      name,
      callback
    })
  }

  /**
   * 触发 Hook
   * @param name
   * @param args
   */
  call (name: string, ...args: any[]) {
    if (!name) throw ErrorMsg.HOOK_NAME_IS_EMPTY
    const waitApplyHooks = this.hooks.filter(item => item.name === name)
    let res
    for (const item of waitApplyHooks) {
      res = item.callback(...args)
    }
    return res
  }
}

export const hooks = new TrackerHooks()
