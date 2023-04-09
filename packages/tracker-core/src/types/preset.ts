import { HookCallback } from './hooks'

export interface PresetContext {
  tap: (name: string, callback: HookCallback) => void
}

export type Preset = (context: PresetContext) => void
