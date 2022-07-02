export type Listener = (...args: any[]) => void

export interface EventNode {
  listener: (...args: any[]) => void;
  context?: any;
}

export interface EventCenterInterface {

  on: (eventName: string, listener: Listener, context?: any) => void;

  once: (eventName: string, listener: Listener, context?: any) => void;

  off: (eventName?: string, listener?: Listener, context?: any) => void;

  trigger: (eventName: string, ...args: any[]) => void;
}
