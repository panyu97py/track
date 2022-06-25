'use strict';
import {container, SERVICE_IDENTIFIER, TrackEventDataProcess} from '../src'
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
    const trackEventDataProcess: TrackEventDataProcess = container.get(SERVICE_IDENTIFIER.TRACK_EVENT_DATA_PROCESS)

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

});
