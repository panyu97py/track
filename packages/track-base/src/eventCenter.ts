import type {EventCenterInterface, EventNode, Listener} from './interface'

class EventCenter implements EventCenterInterface {
    eventMap: Record<string, EventNode[]>;

    off(eventName?: string, listener?: Listener, context?: any): void {
        console.log(eventName, listener, context)
    }

    on(eventName: string, listener?: Listener, context?: any): void {
        console.log(eventName, listener, context)
    }

    once(eventName: string, listener?: Listener, context?: any): void {
        console.log(eventName, listener, context)
    }

    trigger(eventName: string, args: any): void {
        console.log(eventName, args)
    }

}

export default EventCenter
export const eventCenter = new EventCenter()
