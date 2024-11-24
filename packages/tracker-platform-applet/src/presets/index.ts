import { definePreset, internalPreset } from '@trackerjs/core'
import { pluginAppletRequest } from './plugin-request'
import Taro from '@tarojs/taro'

export const presetApplet = definePreset((opt: Taro.request.Option) => {
  return () => {
    return {
      plugins: [pluginAppletRequest(opt)],
      presets: [internalPreset()]
    }
  }
})
