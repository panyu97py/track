'use strict';
import {container, SERVICE_IDENTIFIER, TrackEventDataProcess} from '../src'
import {DEFAULT_EVENT_CONFIG} from "../src/constants";

describe('generateEventKey', () => {

    it('should ', function () {

        const trackEventDataProcess: TrackEventDataProcess = container.get(SERVICE_IDENTIFIER.TRACK_EVENT_DATA_PROCESS)

        const {eventExposureConfig} = DEFAULT_EVENT_CONFIG.PAGE_EXPOSURE_CONFIG

        const eventKey = trackEventDataProcess.generateEventKey(eventExposureConfig!)

        expect(eventKey).toEqual(`${eventExposureConfig?.eventType}-${eventExposureConfig?.eventName}`)
    });

});
