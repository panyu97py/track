import { definePreset } from '../helper'
import { pluginTracker } from './plugin-tracker'
import { pluginDataQueue } from './plugin-data-queue'

export const internalPreset = definePreset(() => {
  return () => {
    return {
      plugins: [
        pluginTracker(),
        pluginDataQueue()
      ]
    }
  }
})
