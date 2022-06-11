import type {eventCenter as IEventCenter, IEventNode, listenerType} from './interface'

class EventCenter implements IEventCenter {
    eventMap: Record<string, IEventNode[]>;

    off(eventName?: string, listener?: listenerType, context?: any): void {
        console.log(eventName, listener, context)
    }

    on(eventName: string, listener?: listenerType, context?: any): void {
        console.log(eventName, listener, context)
    }

    once(eventName: string, listener?: listenerType, context?: any): void {
        console.log(eventName, listener, context)
    }

    trigger(eventName: string, args: any): void {
        console.log(eventName, args)
    }

}

export default EventCenter
export const eventCenter = new EventCenter()
