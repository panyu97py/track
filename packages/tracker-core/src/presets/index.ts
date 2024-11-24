import { definePreset } from '../helper'
import { pluginTrack } from './plugin-tracker'

export const internalPreset = definePreset(() => {
  return () => {
    return {
      plugins: [pluginTrack()]
    }
  }
})
