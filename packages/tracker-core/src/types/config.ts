import { PluginCtx } from '../plugin'
import { EventData } from './track-event'

export interface PluginContext extends PluginCtx, Record<string, any> {
  appendEventData: (eventData: EventData) => void
  reportEventData: (eventDataList: EventData[]) => void
}

export type Plugin = (opts?: any) => (ctx: PluginContext) => void

export type Preset = (opts?: any) => (ctx: PluginContext) => {
  plugins?: ReturnType<Plugin>[],
  presets?: ReturnType<Preset>[]
}

export interface Config extends Record<string, any> {
  plugins?: ReturnType<Plugin>[]
  presets?: ReturnType<Preset>[]
}
