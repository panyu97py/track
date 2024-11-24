import { definePlugin, EventData } from '@trackerjs/core'
import Taro from '@tarojs/taro'

export const pluginAppletRequest = definePlugin((opt:Taro.request.Option) => {
  return (ctx) => {
    ctx.registerMethod('reportEventData', (eventDataList:EventData[]) => {
      Taro.request({ ...opt, data: eventDataList })
    })
  }
})
