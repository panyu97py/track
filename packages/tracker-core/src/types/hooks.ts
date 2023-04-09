export type HookCallback = (...args: any[]) => void

export interface TrackerHookItem {
  name: string;
  callback: HookCallback
}
