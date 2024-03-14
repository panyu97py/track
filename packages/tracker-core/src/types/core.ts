import { Preset } from './preset'

type FunctionReturn<T> = () => T

export interface Config extends Record<string, any> {
  enable: boolean | FunctionReturn<boolean>
  commonInfo: Record<string, any> | FunctionReturn<Record<string, any>>
  queueLimit: number
  presets: Preset[]
}
