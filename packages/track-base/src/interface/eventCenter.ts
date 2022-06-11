export type listenerType = (...args: any[]) => void

export interface IEventNode {
    listener: Function;
    context?: any;
}

export interface eventCenter {
    eventMap: Record<string, IEventNode[]>;

    on: (eventName: string, listener?: listenerType, context?: any) => void;

    once: (eventName: string, listener?: listenerType, context?: any) => void;

    off: (eventName?: string, listener?: listenerType, context?: any) => void;

    trigger: (eventName: string, ...args: any[]) => void;
}
