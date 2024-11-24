import { definePreset } from '../helper'
import { pluginTrack } from './plugin-track'

export const internalPreset = definePreset(() => {
  return () => {
    return {
      plugins: [pluginTrack()]
    }
  }
})
