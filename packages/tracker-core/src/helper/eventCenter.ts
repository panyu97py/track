interface IEventNode {
  listener: Function;
  context?: any;
}

class EventCenter {

  private eventMap: { [key: string]: IEventNode[] }

  constructor () {
    this.eventMap = {}
  }

  /**
   * 监听同个事件，同时绑定多个 handler
   * @param eventName
   * @param listener
   * @param context
   */
  on = (eventName: string, listener: (...args: any[]) => void, context?: any) => {
    if (!this.eventMap[eventName]) this.eventMap[eventName] = []
    this.eventMap[eventName].push({
      context,
      listener
    })
  }

  /**
   * 监听同个事件一次，同时绑定多个 handler
   * @param eventName
   * @param listener
   * @param context
   */
  once = (eventName: string, listener: (...args: any[]) => void, context?: any) => {
    const wrapper = (...args: any[]) => {
      listener.apply(context, args)
      this.off(eventName, wrapper, context)
    }
    this.on(eventName, wrapper, context)
  }

  /**
   * 取消监听事件 | 取消监听一个事件某个 handler | 取消监听所有事件
   * @param eventName
   * @param listener
   * @param context
   */
  off = (eventName: string, listener?: (...args: any[]) => void, context?: any) => {
    const tempEventMap = this.eventMap
    this.eventMap = {}
    if (!eventName) return
    for (let key in tempEventMap) {
      if (key !== eventName && !listener) {
        this.eventMap[key] = tempEventMap[key]
      } else if (listener) {
        this.eventMap[key] = tempEventMap[key].filter(item => item.listener === listener && item.context === context)
      }
    }
  }
  /**
   * 触发个事件
   * @param eventName
   * @param args
   */
  trigger = (eventName: string, ...args: any[]) => {
    if (!eventName) throw `The eventName can't be empty!`
    if (!this.eventMap[eventName]) throw `The event ${eventName} is not register!`
    this.eventMap[eventName].forEach(item => item.listener.apply(item.context, args))
  }
}
