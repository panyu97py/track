import { PluginCtx } from '../plugin'
import { EventData } from './track-event'

export interface PluginContext extends PluginCtx, Record<string, any>{
  submitEventData: (eventData: EventData) => void
  modifyEventData: (eventData: EventData) => any
}

export type Plugin = (opts?: any) => (ctx: PluginContext) => void

export type Preset = (opts?: any) => (ctx: PluginContext) => { plugins: ReturnType<Plugin>[] }

export interface Config extends Record<string, any> {
  plugins?: ReturnType<Plugin>[]
  presets?: ReturnType<Preset>[]
}
