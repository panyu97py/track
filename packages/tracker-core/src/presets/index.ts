import { definePreset } from '../helper'
import { initInternalMethods } from './init-internal-methods'

export const internalPreset = definePreset(() => {
  return () => {
    return {
      plugins: [initInternalMethods()]
    }
  }
})
