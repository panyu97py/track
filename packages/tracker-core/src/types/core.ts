
type FunctionReturn<T> = () => T

export interface TrackerBaseConfig {
  enable: boolean | FunctionReturn<boolean>
  commonInfo: Record<string, any> | FunctionReturn<Record<string, any>>
}
