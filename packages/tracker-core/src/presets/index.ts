import { definePreset } from '../helper'
import { pluginTracker } from './plugin-tracker'
import { pluginDataQueue } from './plugin-data-queue'

export interface PresetInternalOpt {
  limitCount?: number
}

export const presetInternal = definePreset((opt?: PresetInternalOpt) => {
  return () => {
    return {
      plugins: [
        pluginTracker(),
        pluginDataQueue({ limitCount: opt?.limitCount })
      ]
    }
  }
})
