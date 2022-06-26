import {injectable} from "inversify";
import {ERROR_MSG} from "../constants";
import type {EventCenterInterface, EventNode, Listener} from '../interface'

@injectable()
export class EventCenter implements EventCenterInterface {

    private _eventMap: Map<string, EventNode[]> = new Map();

    /**
     * 监听事件
     * @param eventName
     * @param listener
     * @param context
     */
    on(eventName: string, listener: Listener, context?: any): void {

        if (!this._eventMap.has(eventName)) this._eventMap.set(eventName, [])

        this._eventMap.get(eventName)?.push({listener, context})
    }

    /**
     * 监听同个事件一次
     * @param eventName
     * @param listener
     * @param context
     */
    once(eventName: string, listener: Listener, context?: any): void {

        const wrapper = (...args: any[]) => {

            listener.apply(context, args)

            this.off(eventName, wrapper, context)
        }

        this.on(eventName, wrapper, context)
    }

    /**
     * 取消监听事件
     * @param eventName
     * @param listener
     * @param context
     */
    off(eventName: string, listener?: Listener, context?: any): void {

        if (!eventName) throw ERROR_MSG.EVENT_NAME_IS_EMPTY

        if (!this._eventMap.has(eventName)) throw ERROR_MSG.EVENT_NAME_IS_NOR_REGISTER

        if (!listener) {
            this._eventMap.delete(eventName)
            return
        }

        const tempEventNodeList = this._eventMap.get(eventName)?.filter(item => !(item.listener === listener && item.context === context)) || []

        this._eventMap.set(eventName, tempEventNodeList)
    }

    /**
     * 触发事件
     * @param eventName
     * @param args
     */
    trigger(eventName: string, ...args: any[]): void {

        const tempEventNodeList = this._eventMap.get(eventName)

        if (!tempEventNodeList) throw ERROR_MSG.EVENT_NAME_IS_NOR_REGISTER

        tempEventNodeList.forEach(item => item.listener.apply(item.context, args))

    }

}
