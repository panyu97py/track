import {v4 as generateUUID} from 'uuid'
import {EVENT_TYPE, ERROR_MSG} from "./constants";
import type {
    EventConfig,
    EventData,
    EventType,
    SimpleEventData,
    SubmitTrackDataType,
    TargetTrackConfig,
    TrackEventDataProcessInstance
} from './interface'
import {FiledlEventIdSimpleEventData} from "./interface";


export class EventDataProcess implements TrackEventDataProcessInstance {

    /**
     * 点击事件数据列表
     * @desc 保存当前页面所有点击事件
     */
    clickEventDataMap: Map<string, FiledlEventIdSimpleEventData>;

    /**
     * 曝光事件数据列表
     * @desc 仅保存当前页面可视元素
     */
    exposureEventDataMap: Map<string, FiledlEventIdSimpleEventData>;


    /**
     * 提交事件数据
     * @param trackData
     */
    submitTrackData: SubmitTrackDataType;

    /**
     * 构造函数
     * @param submitTrackData
     */
    constructor(submitTrackData: SubmitTrackDataType) {
        this.submitTrackData = submitTrackData
    }

    /**
     * 填充事件来源 id
     * @param trackData
     * @param config
     */
    fillReferrerId(trackData: SimpleEventData, config: EventConfig): FiledlEventIdSimpleEventData {
        console.log({trackData, config})
        return {
            eventId: '',
            referrerId: '',
            eventType: 'string',
            eventName: 'string',
            startTime: 0,
            extendData: {}
        };
    }

    /**
     * 填充事件结束时间
     * @param trackData
     * @param type
     */
    fillEndTime(trackData: FiledlEventIdSimpleEventData, type: EventType): EventData {

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
     * @param trackConfig
     * @param config
     */
    generateEventKey(trackConfig: TargetTrackConfig, config: EventConfig): string {

        const {eventType, eventName, extendsPrimaryKey} = config

        const {extendData: trackExtends} = trackConfig

        const baseEventKey = `${eventType}-${eventName}`

        if (!(trackExtends && extendsPrimaryKey && trackExtends[extendsPrimaryKey])) return baseEventKey

        return `${baseEventKey}-${trackExtends[extendsPrimaryKey]}`
    }


    /**
     * 生成事件数据
     * @param trackConfig
     * @param config
     */
    generateEventData(trackConfig: TargetTrackConfig, config: EventConfig): FiledlEventIdSimpleEventData {

        const {eventType, eventName} = config

        const {extendData = {}} = trackConfig

        const eventId = generateUUID()

        const startTime = new Date().getTime()

        const simpleEvent = {eventId, eventType, eventName, extendData, startTime}

        return this.fillReferrerId(simpleEvent, config);
    }

    /**
     * 目标元素点击
     * @param trackConfig
     */
    targetClick(trackConfig: TargetTrackConfig): void {

        const eventConfig = this.getEventConfig(trackConfig, EVENT_TYPE.CLICK)

        const simpleEventData = this.generateEventData(trackConfig, eventConfig)

        const eventData = this.fillEndTime(simpleEventData, EVENT_TYPE.CLICK)

        const eventKey = this.generateEventKey(trackConfig, eventConfig)

        this.clickEventDataMap.set(eventKey, eventData)

        this.submitTrackData(eventData)
    }

    /**
     * 目标元素开始曝光
     * @param trackConfig
     */
    targetBeginExposure(trackConfig: TargetTrackConfig): void {

        const eventConfig = this.getEventConfig(trackConfig, EVENT_TYPE.EXPOSURE)

        const eventData = this.generateEventData(trackConfig, eventConfig)

        const eventKey = this.generateEventKey(trackConfig, eventConfig)

        this.exposureEventDataMap.set(eventKey, eventData)
    }

    /**
     * 目标元素停止曝光
     * @param trackConfig
     */
    targetEndExposure(trackConfig: TargetTrackConfig): void {

        const eventConfig = this.getEventConfig(trackConfig, EVENT_TYPE.EXPOSURE)

        const eventKey = this.generateEventKey(trackConfig, eventConfig)

        const simpleEvent = this.exposureEventDataMap.get(eventKey)

        if (!simpleEvent) return

        const eventData = this.fillEndTime(simpleEvent, EVENT_TYPE.EXPOSURE)

        this.submitTrackData(eventData as EventData)
    }

}
