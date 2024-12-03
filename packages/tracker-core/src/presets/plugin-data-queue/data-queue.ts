import { EventData } from '../../types'

type Callback = (eventDataList: EventData[]) => void

export class DataQueue {
  private limitCount: number

  /**
   * 事件队列
   * @private
   */
  private eventsQueue: EventData[] = []

  /**
   * 实例
   */
  private static dataQueueInstance: DataQueue

  /**
   * 输出埋点数据的回调函数
   */
  private callback: Callback

  /**
   * 获取实例
   */
  public static getInstance = () => {
    if (!this.dataQueueInstance) {
      this.dataQueueInstance = new DataQueue()
    }
    return this.dataQueueInstance
  }

  /**
   * 设置队列限制数量
   * @param limitCount
   */
  public setLimitCount = (limitCount:number) => {
    this.limitCount = limitCount
  }

  /**
   * 插入数据
   * @param data
   */
  public appendData = (data: EventData) => {
    this.eventsQueue.push(data)
    if (this.eventsQueue.length > this.limitCount) this.reportData()
  }

  /**
   * 提交事件队列
   * @private
   */
  public reportData = () => {
    const len = this.eventsQueue.length
    if (!len) return
    const eventDataList = this.eventsQueue.splice(0, len)
    this.callback(eventDataList)
  }

  public registerCallback = (callback: Callback) => {
    this.callback = callback
  }
}
