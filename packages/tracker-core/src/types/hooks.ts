export type HookCallback = (...args: any[]) => any

export interface TrackerHookItem {
  name: string;
  callback: HookCallback
}
