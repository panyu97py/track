export type Listener = (...args: any[]) => void

export interface EventNode {
    listener: Function;
    context?: any;
}

export interface EventCenterInterface {
    eventMap: Record<string, EventNode[]>;

    on: (eventName: string, listener?: Listener, context?: any) => void;

    once: (eventName: string, listener?: Listener, context?: any) => void;

    off: (eventName?: string, listener?: Listener, context?: any) => void;

    trigger: (eventName: string, ...args: any[]) => void;
}
