import type {
    eventConfig,
    eventData,
    eventType,
    simpleEventData,
    submitTrackDataType,
    targetTrackConfig,
    TrackEventDataProcessInstance
} from './interface'

import {EVENT_TYPE} from "./constants";

export class EventDataProcess implements TrackEventDataProcessInstance {

    /**
     * 点击事件数据列表
     * @desc 保存当前页面所有点击事件
     */
    clickEventDataList: Map<string, simpleEventData>;

    /**
     * 曝光事件数据列表
     * @desc 仅保存当前页面可视元素
     */
    exposureEventDataList: Map<string, simpleEventData>;


    /**
     * 提交事件数据
     * @param trackData
     */
    submitTrackData: (trackData: eventData) => void;

    constructor(submitTrackData: submitTrackDataType) {
        this.submitTrackData = submitTrackData
    }

    /**
     * 填充事件来源 id
     * @param trackData
     * @param config
     */
    fillReferrerId(trackData: simpleEventData, config: eventConfig): simpleEventData {
        console.log({trackData, config})
        return {
            eventId: '',
            eventType: 'string',
            eventName: 'string',
        };
    }

    /**
     * 生成事件数据
     * @param trackConfig
     * @param type
     */
    generateEventData(trackConfig: targetTrackConfig, type: eventType): simpleEventData {

        const eventConfig = (() => {
            switch (type) {
                case EVENT_TYPE.CLICK:
                    return trackConfig.eventClickConfig;
                case EVENT_TYPE.EXPOSURE:
                    return trackConfig.eventExposureConfig;
            }
        })()

        if (!eventConfig) throw ''

        const simpleEvent = {
            eventId: '',
            eventType: 'string',
            eventName: 'string',
        }
        return this.fillReferrerId(simpleEvent, eventConfig);
    }

    /**
     * 目标元素点击
     * @param trackConfig
     */
    targetClick(trackConfig: targetTrackConfig): void {
        console.log({trackConfig})
    }

    /**
     * 目标元素开始曝光
     * @param trackConfig
     */
    targetBeginExposure(trackConfig: targetTrackConfig): void {
        console.log({trackConfig})
    }

    /**
     * 目标元素停止曝光
     * @param trackConfig
     */
    targetEndExposure(trackConfig: targetTrackConfig): void {
        console.log({trackConfig})
    }

    /**
     * 目标元素曝光计算
     * @param trackConfigList
     */
    targetExposureCount(trackConfigList: targetTrackConfig[]): void {
        trackConfigList.forEach(trackConfig => {
            this.targetEndExposure(trackConfig)
            this.targetBeginExposure(trackConfig)
            this.generateEventData(trackConfig, EVENT_TYPE.EXPOSURE as eventType)
        })
        console.log({trackConfigList})
    }

}
