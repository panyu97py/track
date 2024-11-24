import { definePreset } from '../helper'
import { pluginTracker } from './plugin-tracker'
import { pluginDataQueue } from './plugin-data-queue'

interface Opt {
  limitCount?: number
}

export const internalPreset = definePreset((opt?: Opt) => {
  return () => {
    return {
      plugins: [
        pluginTracker(),
        pluginDataQueue({ limitCount: opt?.limitCount })
      ]
    }
  }
})
