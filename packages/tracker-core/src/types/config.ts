import { PluginCtx } from '../plugin'
import { EventConfig, EventData } from './track-event'

export interface PluginContext extends PluginCtx, Record<string, any> {
  appendEventData: (eventData: EventData) => void
  reportEventData: (eventDataList: EventData[]) => void
  trackPageBeginExposure:(pagePath: string, params:Record<string, any>) => void
  trackPageEndExposure: (pagePath: string, params:Record<string, any>) => void
  trackTargetBeginExposure: (eventConfig: EventConfig) => void
  trackTargetEndExposure: (eventConfig: EventConfig) => void
  trackTargetClick: (eventConfig: EventConfig) => void
}

export type Plugin<T = any> = (opts?: T) => (ctx: PluginContext) => void

export type Preset<T = any> = (opts?: T) => (ctx: PluginContext) => {
  plugins?: ReturnType<Plugin>[],
  presets?: ReturnType<Preset>[]
}

export interface Config extends Record<string, any> {
  plugins?: ReturnType<Plugin>[]
  presets?: ReturnType<Preset>[]
}
