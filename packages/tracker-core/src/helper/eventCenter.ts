import { ErrorMsg } from '../constants'
import { EventNode, Listener } from '../types'

export class EventCenter {
  private eventMap: Map<string, EventNode[]> = new Map()

  /**
   * 监听事件
   * @param eventName
   * @param listener
   * @param context
   */
  on (eventName: string, listener: Listener, context?: any): void {
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
  once (eventName: string, listener: Listener, context?: any): void {
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
  off (eventName: string, listener?: Listener, context?: any): void {
    if (!eventName) throw ErrorMsg.EVENT_NAME_IS_EMPTY

    if (!this.eventMap.has(eventName)) throw ErrorMsg.EVENT_NAME_IS_NOR_REGISTER

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

    if (!tempEventNodeList) throw ErrorMsg.EVENT_NAME_IS_NOR_REGISTER

    tempEventNodeList.forEach(item => item.listener.apply(item.context, args))
  }
}
