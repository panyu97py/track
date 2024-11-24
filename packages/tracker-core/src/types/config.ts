import { PluginCtx } from '../plugin'

export type PluginContext = PluginCtx

export type Plugin = (opts?: any) => (ctx: PluginContext) => void

export type Preset = (opts?: any) => (ctx: PluginContext) => { plugins: ReturnType<Plugin>[] }

export interface Config extends Record<string, any> {
  enable?: boolean
  plugins?: ReturnType<Plugin>[]
  presets?: ReturnType<Preset>[]
}
