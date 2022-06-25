import {v4 as generateUUID} from 'uuid'
import {inject, injectable} from 'inversify'
import {EVENT_TYPE, DEFAULT_EVENT_NAME, ERROR_MSG, SERVICE_IDENTIFIER} from "../constants";
import type {
    EventConfig,
    EventData,
    EventType,
    SimpleEventData,
    TargetTrackConfig,
    TrackEventDataProcessInstance,
    FilledEventIdSimpleEventData
} from '../interface'
import {TrackEventQueueManager} from "./TrackEventQueueManager";

@injectable()
export class TrackEventDataProcess implements TrackEventDataProcessInstance {

    /**
     * 事件队列
     * @param trackData
     */
    @inject(SERVICE_IDENTIFIER.TRACK_EVENT_QUEUE_MANAGER)
    private _trackEventQueueManager: TrackEventQueueManager;

    /**
     * 点击事件数据列表
     * @desc 保存当前页面所有点击事件
     */
    clickEventDataMap: Map<string, FilledEventIdSimpleEventData> = new Map();

    /**
     * 曝光事件数据列表
     * @desc 仅保存当前页面可视元素
     */
    exposureEventDataMap: Map<string, FilledEventIdSimpleEventData> = new Map();

    /**
     * 填充事件来源 id
     * @todo 页面曝光事件的处理逻辑
     * @param trackData
     * @param config
     */
    fillReferrerId(trackData: SimpleEventData, config: EventConfig): FilledEventIdSimpleEventData {
        const {
            originEventType = EVENT_TYPE.EXPOSURE,
            originEventName = DEFAULT_EVENT_NAME.PAGE_EXPOSURE,
            relevanceKey
        } = config

        const originEventKey = this.generateEventKey({
            eventType: originEventType,
            eventName: originEventName,
            relevanceKey
        }, trackData.extendData)

        const originEvent = (() => {
            switch (originEventType) {
                case EVENT_TYPE.EXPOSURE:
                    return this.exposureEventDataMap.get(originEventKey)
                case EVENT_TYPE.CLICK:
                    return this.clickEventDataMap.get(originEventKey)
                default:
                    throw ERROR_MSG.UNKNOWN_EVENT_TYPE
            }
        })()

        const {eventId: referrerId = ''} = originEvent || {}

        return {referrerId, ...trackData};
    }

    /**
     * 填充事件结束时间
     * @param trackData
     * @param type
     */
    fillEndTime(trackData: FilledEventIdSimpleEventData, type: EventType): EventData {

        if (type === EVENT_TYPE.CLICK) {
            return {...trackData, endTime: trackData.startTime, duration: 0}
        }

        const endTime = new Date().getTime()

        return {...trackData, endTime, duration: endTime - trackData.startTime}
    }

    /**
     * 获取事件配置
     * @param trackConfig
     * @param type
     */
    getEventConfig(trackConfig: TargetTrackConfig, type: EventType): EventConfig {

        const eventConfig = (() => {
            switch (type) {
                case EVENT_TYPE.CLICK:
                    return trackConfig.eventClickConfig;
                case EVENT_TYPE.EXPOSURE:
                    return trackConfig.eventExposureConfig;
                default:
                    throw ERROR_MSG.UNKNOWN_EVENT_TYPE
            }
        })()

        if (!eventConfig) throw ERROR_MSG.EVENT_CONFIG_IS_NULL

        return eventConfig
    }

    /**
     * 生成事件唯一标识
     * @param config
     * @param extendData
     */
    generateEventKey(config: EventConfig, extendData?: Record<string, any>): string {

        const {eventType, eventName, relevanceKey} = config

        const baseEventKey = `${eventType}-${eventName}`

        if (!(extendData && relevanceKey && extendData[relevanceKey])) return baseEventKey

        return `${baseEventKey}-${extendData[relevanceKey]}`
    }


    /**
     * 生成事件数据
     * @param config
     * @param extendData
     */
    generateEventData(config: EventConfig, extendData?: Record<string, any>): FilledEventIdSimpleEventData {

        const {eventType, eventName} = config

        const eventId = generateUUID()

        const startTime = new Date().getTime()

        const simpleEvent = {eventId, eventType, eventName, extendData: extendData || {}, startTime}

        return this.fillReferrerId(simpleEvent, config);
    }

    /**
     * 目标元素点击
     * @param trackConfig
     */
    targetClick(trackConfig: TargetTrackConfig): void {

        const eventConfig = this.getEventConfig(trackConfig, EVENT_TYPE.CLICK)

        const simpleEventData = this.generateEventData(eventConfig, trackConfig.extendData)

        const eventData = this.fillEndTime(simpleEventData, EVENT_TYPE.CLICK)

        const eventKey = this.generateEventKey(eventConfig, trackConfig.extendData)

        this.clickEventDataMap.set(eventKey, eventData)

        this._trackEventQueueManager.submitEvent(eventData)
    }

    /**
     * 目标元素开始曝光
     * @param trackConfig
     */
    targetBeginExposure(trackConfig: TargetTrackConfig): void {

        const eventConfig = this.getEventConfig(trackConfig, EVENT_TYPE.EXPOSURE)

        const eventData = this.generateEventData(eventConfig, trackConfig.extendData)

        const eventKey = this.generateEventKey(eventConfig, trackConfig.extendData)

        this.exposureEventDataMap.set(eventKey, eventData)
    }

    /**
     * 目标元素停止曝光
     * @param trackConfig
     */
    targetEndExposure(trackConfig: TargetTrackConfig): void {

        const eventConfig = this.getEventConfig(trackConfig, EVENT_TYPE.EXPOSURE)

        const eventKey = this.generateEventKey(eventConfig, trackConfig.extendData)

        const simpleEvent = this.exposureEventDataMap.get(eventKey) || this.generateEventData(eventConfig, trackConfig.extendData)

        const eventData = this.fillEndTime(simpleEvent, EVENT_TYPE.EXPOSURE)

        this._trackEventQueueManager.submitEvent(eventData as EventData)
    }

}
