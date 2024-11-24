import { EventCenter } from './event-center'
import { AnyFn } from '../types'

export class EventHook {
  /**
   * 事件名
   */
  private readonly eventName: string

  /**
   * 事件中心实例
   * @private
   */
  private readonly eventCenter = EventCenter.getInstance()

  constructor (eventName: string) {
    this.eventName = eventName
  }

  /**
   * 注册 Hook
   * @param callback
   */
  tap = (callback: AnyFn) => this.eventCenter.on(this.eventName, callback)

  /**
   * 触发 Hook
   * @param args
   */
  call = (...args: any[]) => this.eventCenter.trigger(this.eventName, ...args)
}
