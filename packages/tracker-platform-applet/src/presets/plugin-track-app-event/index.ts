import { definePlugin, EventData, generateUUIDv4 } from '@trackerjs/core'
import Taro from '@tarojs/taro'
import { systemInfo } from '@/constants'

const generateTimeInfo = () => {
  const startTime = Date.now()
  const endTime = Date.now()
  const duration = endTime - startTime
  return { startTime, endTime, duration }
}

export const pluginTrackAppEvent = definePlugin(() => {
  return (ctx) => {
    const appleSystemInfoEventData:EventData = (() => {
      const eventId = generateUUIDv4()
      const eventName = 'APPLET_SYSTEM_INFO'
      const eventType = 'SYSTEM_EVENT'
      const baseEventData = { eventType, eventId, eventName, extendData: systemInfo }
      const timeInfo = generateTimeInfo()
      return { ...baseEventData, ...timeInfo }
    })()

    ctx.appendEventData(appleSystemInfoEventData)

    Taro.onAppShow((result) => {
      const eventId = generateUUIDv4()
      const eventName = 'APPLET_SHOW'
      const eventType = 'SYSTEM_EVENT'
      const baseEventData = { eventType, eventId, eventName, extendData: result }
      const timeInfo = generateTimeInfo()
      const eventData:EventData = { ...baseEventData, ...timeInfo }
      ctx.appendEventData(eventData)
    })

    Taro.onAppHide((result) => {
      const eventId = generateUUIDv4()
      const eventName = 'APPLET_HIDE'
      const eventType = 'SYSTEM_EVENT'
      const baseEventData = { eventType, eventId, eventName, extendData: result }
      const timeInfo = generateTimeInfo()
      const eventData:EventData = { ...baseEventData, ...timeInfo }
      ctx.appendEventData(eventData)
    })
  }
})
