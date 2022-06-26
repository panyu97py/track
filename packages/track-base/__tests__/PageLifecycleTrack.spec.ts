'use strict';
import {
    container,
    SERVICE_IDENTIFIER,
    PageLifecycleTrack,
    TrackEventQueueManager,
    TrackEventDataProcess,
    EventCenter
} from '../src'
import {TargetTrackConfig} from "../src/interface";
import {EVENT_TYPE, EVENT_DATA_PROCESS_TYPE} from "../src/constants";
import {ConfigStore} from "../src/store";

const defaultExampleEventConfig: TargetTrackConfig = {
    eventExposureConfig: {
        eventType: EVENT_TYPE.EXPOSURE,
        eventName: 'DEFAULT_EXAMPLE_EXPOSURE',
        relevanceKey: 'exampleId'
    },
    eventClickConfig: {
        eventType: EVENT_TYPE.CLICK,
        eventName: 'DEFAULT_EXAMPLE_CLICK',
        relevanceKey: 'exampleId',
        originEventType: EVENT_TYPE.EXPOSURE,
        originEventName: 'DEFAULT_EXAMPLE_EXPOSURE'
    },
    extendData: {
        exampleId: 'exampleId'
    }
}

describe('PageLifecycleTrack', () => {

    const pageLifecycleTrack = container.get<PageLifecycleTrack>(SERVICE_IDENTIFIER.PAGE_LIFECYCLE_TRACK)

    const eventCenter = container.get<EventCenter>(SERVICE_IDENTIFIER.EVENT_CENTER)

    const configStore = container.get<ConfigStore>(SERVICE_IDENTIFIER.CONFIG_STORE)

    configStore.enableLog = true

    const trackEventQueueManager: TrackEventQueueManager = (pageLifecycleTrack as any)._trackEventQueueManager

    const trackEventDataProcess: TrackEventDataProcess = (pageLifecycleTrack as any)._trackEventDataProcess

    const spyTargetClick = jest.spyOn(trackEventDataProcess, 'targetClick')

    const spyTargetBeginExposure = jest.spyOn(trackEventDataProcess, 'targetBeginExposure')

    const spyTargetEndExposure = jest.spyOn(trackEventDataProcess, 'targetEndExposure')

    const spySubmitEvent = jest.spyOn(trackEventQueueManager, 'submitEvent')

    const PAGE_KEY = 'PAGE_KEY'

    describe('pageOnShow', () => {

        pageLifecycleTrack.pageOnShow(PAGE_KEY)

        it('click event trigger', () => {

            eventCenter.trigger(PAGE_KEY, defaultExampleEventConfig, EVENT_DATA_PROCESS_TYPE.CLICK)

            expect(spyTargetClick).toHaveBeenCalled()

            expect(spySubmitEvent).toHaveBeenCalled()
        })

        it('exposure  event trigger', async () => {
            eventCenter.trigger(PAGE_KEY, defaultExampleEventConfig, EVENT_DATA_PROCESS_TYPE.BEGIN_EXPOSURE)

            await new Promise<void>(resolve => {
                setTimeout(() => {
                    eventCenter.trigger(PAGE_KEY, defaultExampleEventConfig, EVENT_DATA_PROCESS_TYPE.END_EXPOSURE)
                    resolve()
                }, 500)
            })

            expect(spyTargetBeginExposure).toHaveBeenCalled()

            expect(spyTargetEndExposure).toHaveBeenCalled()

            expect(spySubmitEvent).toHaveBeenCalled()
        })

    })

    it('pageOnHide', () => {

        const spySubmitEventsQueue = jest.spyOn(trackEventQueueManager, 'submitEventsQueue')

        pageLifecycleTrack.pageOnHide()

        expect(spyTargetEndExposure).toHaveBeenCalled()

        expect(spySubmitEvent).toHaveBeenCalled()

        expect(spySubmitEventsQueue).toHaveBeenCalled()
    })
})
