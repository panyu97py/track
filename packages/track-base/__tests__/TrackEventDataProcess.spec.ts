'use strict';
import "reflect-metadata"
import {container, SERVICE_IDENTIFIER, TrackEventDataProcess} from '../src'
import {DEFAULT_EVENT_CONFIG} from "../src/constants";

describe('TrackEventDataProcess', () => {
    const trackEventDataProcess: TrackEventDataProcess = container.get(SERVICE_IDENTIFIER.TRACK_EVENT_DATA_PROCESS)
    trackEventDataProcess.targetEndExposure(DEFAULT_EVENT_CONFIG.PAGE_EXPOSURE_CONFIG)
});
