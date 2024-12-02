import { PluginCtx } from '../plugin'
import { EventConfig, EventData } from './track-event'

export interface PluginContext extends PluginCtx, Record<string, any> {
  appendEventData: (eventData: EventData) => void
  reportEventData: (eventDataList: EventData[]) => void
  trackTargetBeginExposure:(eventConfig: EventConfig) => void
  trackTargetEndExposure:(eventConfig: EventConfig) => void
  trackPageBeginExposure:(eventConfig: EventConfig) => void
  trackPageEndExposure:(eventConfig: EventConfig) => void
  trackTargetClick:(eventConfig: EventConfig) => void
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
