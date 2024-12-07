import { definePlugin, EventData } from '@trackerjs/core'
import Taro from '@tarojs/taro'
import { deviceId, sessionId } from '../../constants'

export const pluginAppletRequest = definePlugin((opt:Taro.request.Option) => {
  return (ctx) => {
    ctx.registerMethod('reportEventData', (eventDataList:EventData[]) => {
      const { header: optHeader, ...otherOpt } = opt
      const header = { ...optHeader, 'tracker-session-id': sessionId, 'tracker-device-id': deviceId }
      Taro.request({ ...otherOpt, header, data: eventDataList })
    })
  }
})
