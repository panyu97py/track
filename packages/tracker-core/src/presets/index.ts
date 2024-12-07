import { definePreset } from '../helper'
// import { pluginTracker } from './plugin-tracker'
import { pluginDataQueue } from './plugin-data-queue'

export interface PresetInternalOpt {
  limitCount?: number
}

export const presetInternal = definePreset<PresetInternalOpt>((opt) => {
  return () => {
    return {
      plugins: [
        // pluginTracker(),
        pluginDataQueue({ limitCount: opt?.limitCount })
      ]
    }
  }
})
