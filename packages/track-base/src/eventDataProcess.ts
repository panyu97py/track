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


export class EventDataProcess implements TrackEventDataProcessInstance {

    /**
     * 点击事件数据列表
     * @desc 保存当前页面所有点击事件
     */
    clickEventDataMap: Map<string, SimpleEventData>;

    /**
     * 曝光事件数据列表
     * @desc 仅保存当前页面可视元素
     */
    exposureEventDataMap: Map<string, SimpleEventData>;


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
    fillReferrerId(trackData: SimpleEventData, config: EventConfig): SimpleEventData {
        console.log({trackData, config})
        return {
            eventId: '',
            eventType: 'string',
            eventName: 'string',
        };
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
     * @param trackData
     * @param config
     */
    generateEventKey(trackData: SimpleEventData, config: EventConfig): string {

        const {eventType, eventName, extendsPrimaryKey} = config

        const {extends: trackExtends} = trackData

        const baseEventKey = `${eventType}-${eventName}`

        if (!(trackExtends && extendsPrimaryKey && trackExtends[extendsPrimaryKey])) return baseEventKey

        return `${baseEventKey}-${trackExtends[extendsPrimaryKey]}`
    }


    /**
     * 生成事件数据
     * @param trackConfig
     * @param config
     */
    generateEventData(trackConfig: TargetTrackConfig, config: EventConfig): SimpleEventData {

        const {eventType, eventName} = config

        const {extendData} = trackConfig

        const eventId = generateUUID()

        const startTime = new Date().getTime()

        const simpleEvent = (() => {
            switch (eventType) {
                case EVENT_TYPE.CLICK:
                    return {eventId, eventType, eventName, extendData, startTime, endTime: startTime, duration: 0}
                case EVENT_TYPE.EXPOSURE:
                    return {eventId, eventType, eventName, extendData, startTime}
                default:
                    throw ERROR_MSG.UNKNOWN_EVENT_TYPE
            }
        })()

        return this.fillReferrerId(simpleEvent, config);
    }

    /**
     * 目标元素点击
     * @param trackConfig
     */
    targetClick(trackConfig: TargetTrackConfig): void {
        const eventConfig = this.getEventConfig(trackConfig, EVENT_TYPE.CLICK)
        const eventData = this.generateEventData(trackConfig, eventConfig)
        const eventKey = this.generateEventKey(eventData, eventConfig)
        this.clickEventDataMap.set(eventKey, eventData)
        this.submitTrackData(eventData as EventData)
    }

    /**
     * 目标元素开始曝光
     * @param trackConfig
     */
    targetBeginExposure(trackConfig: TargetTrackConfig): void {
        console.log({trackConfig})
    }

    /**
     * 目标元素停止曝光
     * @param trackConfig
     */
    targetEndExposure(trackConfig: TargetTrackConfig): void {
        console.log({trackConfig})
    }

    /**
     * 目标元素曝光计算
     * @param trackConfigList
     */
    targetExposureCount(trackConfigList: TargetTrackConfig[]): void {
        trackConfigList.forEach(trackConfig => {
            this.targetEndExposure(trackConfig)
            this.targetBeginExposure(trackConfig)
        })
        console.log({trackConfigList})
    }

}
