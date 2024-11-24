import { AnyFn } from '../types'

export interface EventNode {
  listener: AnyFn;
  context?: any;
}

export class EventCenter {
  private eventMap: Map<string, EventNode[]> = new Map()

  private static instance: EventCenter

  // 提供获取全局唯一实例的方法
  static getInstance () {
    if (this.instance === null) {
      this.instance = new EventCenter()
    }
    return this.instance
  }

  /**
   * 监听事件
   * @param eventName
   * @param listener
   * @param context
   */
  on (eventName: string, listener: AnyFn, context?: any): void {
    if (!this.eventMap.has(eventName)) this.eventMap.set(eventName, [])

    this.eventMap.get(eventName)?.push({
      listener,
      context
    })
  }

  /**
   * 监听同个事件一次
   * @param eventName
   * @param listener
   * @param context
   */
  once (eventName: string, listener: AnyFn, context?: any): void {
    const wrapper = (...args: any[]) => {
      listener.apply(context, args)

      this.off(eventName, wrapper, context)
    }

    this.on(eventName, wrapper, context)
  }

  /**
   * 取消监听事件
   * @param eventName
   * @param listener
   * @param context
   */
  off (eventName: string, listener?: AnyFn, context?: any): void {
    if (!eventName) throw new Error('event name is required')

    if (!this.eventMap.has(eventName)) throw new Error('event name is not registered')

    if (!listener) {
      this.eventMap.delete(eventName)
      return
    }

    const tempEventNodeList = this.eventMap.get(eventName)?.filter(item => !(item.listener === listener && item.context === context)) || []

    this.eventMap.set(eventName, tempEventNodeList)
  }

  /**
   * 触发事件
   * @param eventName
   * @param args
   */
  trigger (eventName: string, ...args: any[]): void {
    const tempEventNodeList = this.eventMap.get(eventName)

    if (!tempEventNodeList) throw new Error('event name is not registered')

    tempEventNodeList.forEach(item => item.listener.apply(item.context, args))
  }
}
