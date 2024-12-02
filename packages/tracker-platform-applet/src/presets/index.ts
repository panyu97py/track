import { definePreset, internalPreset } from '@trackerjs/core'
import { pluginAppletRequest } from './plugin-request'
import Taro from '@tarojs/taro'
import { pluginTriggerEvent } from './plugin-trigger-event'

export const presetApplet = definePreset((opt: Taro.request.Option) => {
  return () => {
    return {
      presets: [internalPreset()],
      plugins: [
        pluginAppletRequest(opt),
        pluginTriggerEvent()
      ]
    }
  }
})
