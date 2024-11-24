import { definePreset } from '../helper'
import { pluginTracker } from './plugin-tracker'

export const internalPreset = definePreset(() => {
  return () => {
    return {
      plugins: [pluginTracker()]
    }
  }
})
