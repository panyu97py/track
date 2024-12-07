import { definePlugin } from '../../helper'
import { DataQueue } from './data-queue'
import { EventData } from '../../types'

interface Opt {
  limitCount?: number
}

export const pluginDataQueue = definePlugin((opt?: Opt) => {
  return (ctx) => {
    const dataQueue = DataQueue.getInstance()

    ctx.registerMethod('appendEventData', dataQueue.appendData)

    dataQueue.registerCallback((eventDataList: EventData[]) => ctx.reportEventData(eventDataList))

    dataQueue.setLimitCount(opt?.limitCount || 10)
  }
})
