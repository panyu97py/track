import {injectable} from "inversify";
import type {EventCenterInterface, EventNode, Listener} from '../interface'

@injectable()
export class EventCenter implements EventCenterInterface {
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
