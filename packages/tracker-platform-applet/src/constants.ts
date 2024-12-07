import { CurrentInfo } from './types'
import { generateUUIDv4 } from '@trackerjs/core'
import Taro from '@tarojs/taro'

export const Current: CurrentInfo = {
  pageReferrerInfo: null
}

export const sessionId: string = generateUUIDv4()

export const deviceId: string = (() => {
  const localDeviceId = Taro.getStorageSync('tracker-deviceId')
  const finalDeviceId = localDeviceId || generateUUIDv4()
  if (!localDeviceId) Taro.setStorageSync('tracker-deviceId', finalDeviceId)
  return finalDeviceId
})()

export const systemInfo = Taro.getSystemInfoSync()
