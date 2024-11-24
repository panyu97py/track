import { definePlugin } from '../../helper'
import { DataQueue } from './data-queue'

interface Opt {
  limitCount?: number
}

export const pluginDataQueue = definePlugin((opt?: Opt) => {
  return (ctx) => {
    const dataQueue = DataQueue.getInstance()

    dataQueue.setLimitCount(opt?.limitCount || 10)

    dataQueue.registerCallback(ctx.reportEventData)

    ctx.registerMethod('appendEventData', dataQueue.appendData)
  }
})
