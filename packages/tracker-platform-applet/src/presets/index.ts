import { definePreset, presetInternal, PresetInternalOpt } from '@trackerjs/core'
import { pluginAppletRequest } from './plugin-request'
import Taro from '@tarojs/taro'
import { pluginTriggerEvent } from './plugin-trigger-event'

type AppletPresetOpt = Taro.request.Option & PresetInternalOpt

export const presetApplet = definePreset((opt: AppletPresetOpt) => {
  return () => {
    return {
      presets: [presetInternal()],
      plugins: [
        pluginAppletRequest(opt),
        pluginTriggerEvent()
      ]
    }
  }
})
