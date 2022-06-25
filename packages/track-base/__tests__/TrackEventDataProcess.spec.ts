'use strict';
import {container, SERVICE_IDENTIFIER, TrackEventDataProcess, TrackEventQueueManager} from '../src'
import {EVENT_TYPE} from "../src/constants";
import {TargetTrackConfig} from "../src/interface";

const exampleEventConfig: TargetTrackConfig = {
    eventExposureConfig: {
        eventType: EVENT_TYPE.EXPOSURE,
        eventName: 'EXAMPLE_EXPOSURE',
        relevanceKey: 'exampleId'
    },
    eventClickConfig: {
        eventType: EVENT_TYPE.EXPOSURE,
        eventName: 'EXAMPLE_CLICK',
        relevanceKey: 'exampleId'
    },
    extendData: {
        exampleId: 'exampleId'
    }
}

describe('trackEventDataProcess', () => {

    const trackEventDataProcess = container.get<TrackEventDataProcess>(SERVICE_IDENTIFIER.TRACK_EVENT_DATA_PROCESS)

    const trackEventQueueManager: TrackEventQueueManager = (trackEventDataProcess as any)._trackEventQueueManager

    const spySubmitEventsQueue = jest.spyOn(trackEventQueueManager, 'submitEvent')

    describe('generateEventKey', () => {

        it('no extendData', () => {

            const {eventExposureConfig} = exampleEventConfig

            const eventKey = trackEventDataProcess.generateEventKey(eventExposureConfig!)

            expect(eventKey).toEqual(`${eventExposureConfig?.eventType}-${eventExposureConfig?.eventName}`)
        });

        it('exit extendData', () => {

            const {eventExposureConfig, extendData} = exampleEventConfig

            const eventKey = trackEventDataProcess.generateEventKey(eventExposureConfig!, extendData!)

            expect(eventKey).toEqual(`${eventExposureConfig?.eventType}-${eventExposureConfig?.eventName}-${extendData?.exampleId}`)
        })

    })

    describe('getEventConfig', () => {

        it('exposure event config', () => {

            const eventConfig = trackEventDataProcess.getEventConfig(exampleEventConfig, EVENT_TYPE.EXPOSURE)

            expect(eventConfig).toEqual(exampleEventConfig.eventExposureConfig)
        })

        it('click event config', () => {

            const eventConfig = trackEventDataProcess.getEventConfig(exampleEventConfig, EVENT_TYPE.CLICK)

            expect(eventConfig).toEqual(exampleEventConfig.eventClickConfig)
        })

    })

    describe('generateEventData', () => {

    })

    describe('fillReferrerId', () => {

    })

    describe('fillEndTime', () => {

        it('fill click event end time', () => {

            const simpleEventData = trackEventDataProcess.generateEventData(exampleEventConfig.eventClickConfig!)

            const eventData = trackEventDataProcess.fillEndTime(simpleEventData, EVENT_TYPE.CLICK)

            expect(eventData.duration).toBe(0)

            expect(eventData.startTime).toBe(eventData.endTime)

        })

        it('fill exposure event end time', () => {

            const simpleEventData = trackEventDataProcess.generateEventData(exampleEventConfig.eventExposureConfig!)

            const eventData = trackEventDataProcess.fillEndTime(simpleEventData, EVENT_TYPE.EXPOSURE)

            expect(eventData.duration).toBe(eventData.endTime - eventData.startTime)

        })

    })

    describe('targetBeginExposure', () => {

        trackEventDataProcess.targetBeginExposure(exampleEventConfig)

        const {eventExposureConfig} = exampleEventConfig

        const eventKey = trackEventDataProcess.generateEventKey(eventExposureConfig!, exampleEventConfig.extendData)

        expect(trackEventDataProcess.exposureEventDataMap.get(eventKey)).toBeTruthy()

    })

    describe('targetEndExposure', () => {

        it('',async ()=>{

            trackEventDataProcess.targetBeginExposure(exampleEventConfig)

            await new Promise<void>(resolve => setTimeout(() => {
                trackEventDataProcess.targetEndExposure(exampleEventConfig)
                resolve()
            }, 500))

            const {eventExposureConfig} = exampleEventConfig

            const eventKey = trackEventDataProcess.generateEventKey(eventExposureConfig!, exampleEventConfig.extendData)

            expect(spySubmitEventsQueue).toHaveBeenCalled()

            expect(trackEventDataProcess.exposureEventDataMap.get(eventKey)).toBeUndefined()
        })

    })

    describe('targetClick', () => {

        it('target click track', () => {

            trackEventDataProcess.targetClick(exampleEventConfig)

            const {eventClickConfig} = exampleEventConfig

            const eventKey = trackEventDataProcess.generateEventKey(eventClickConfig!, exampleEventConfig.extendData)

            expect(spySubmitEventsQueue).toHaveBeenCalled()

            expect(trackEventDataProcess.clickEventDataMap.get(eventKey)).toBeTruthy()

        })

    })

});
