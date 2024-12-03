import { Plugin, Preset } from '../types'

export const definePlugin = <T>(plugin:Plugin<T>) => plugin

export const definePreset = <T>(preset:Preset<T>) => preset
