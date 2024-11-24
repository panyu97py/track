import { definePreset, internalPreset } from '@trackerjs/core'
import { pluginAppletRequest } from './plugin-request'

export const presetApplet = definePreset(() => {
  return () => {
    return {
      plugins: [pluginAppletRequest()],
      presets: [internalPreset()]
    }
  }
})
