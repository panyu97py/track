import { HookCallback, TrackerHookItem } from '../types'
import { EventCenter } from './eventCenter'

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
    if (!name) throw new Error('name 不能为空')
    if (typeof callback !== 'function') throw new Error('callback 必须为一个函数')
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
    if (!name) throw new Error('name 不能为空')
    const waitApplyHooks = this.hooks.filter(item => item.name === name)
    let res
    for (const item of waitApplyHooks) {
      res = item.callback(...args)
    }
    return res
  }
}

export const hooks = new TrackerHooks()
