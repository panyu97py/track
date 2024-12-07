import { definePreset, presetInternal, PresetInternalOpt } from '@trackerjs/core'
import { pluginAppletRequest } from './plugin-request'
import Taro from '@tarojs/taro'
import { pluginTriggerEvent } from './plugin-trigger-event'
import { pluginTrackAppEvent } from '@/presets/plugin-track-app-event'

type AppletPresetOpt = Taro.request.Option & PresetInternalOpt

export const presetApplet = definePreset<AppletPresetOpt>((opt) => {
  return () => {
    return {
      presets: [presetInternal()],
      plugins: [
        pluginAppletRequest(opt),
        pluginTrackAppEvent(),
        pluginTriggerEvent()
      ]
    }
  }
})
