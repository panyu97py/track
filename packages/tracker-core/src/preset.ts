import { Preset } from './types'

/**
 * 定义 preset
 * @param presetGenerate
 */
export const definePreset = (presetGenerate: (option: Record<any, any>) => Preset) => presetGenerate
