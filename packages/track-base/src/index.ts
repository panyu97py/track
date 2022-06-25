import "reflect-metadata"
import {noop} from './utils'
import container from './container'
import {SERVICE_IDENTIFIER, EVENT_TYPE, DEFAULT_EVENT_CONFIG, DEFAULT_EVENT_NAME} from './constants'
import {EventCenter, TrackEventDataProcess, TrackEventQueueManager, PageLifecycleTrack} from './impl'
import {initBaseTrack} from './initBaseTrack'

import type {EventType, TargetTrackConfig, EventConfig} from './interface'

export type {
    EventType,
    EventConfig,
    TargetTrackConfig
}

export {
    noop,
    initBaseTrack,
    EventCenter,
    TrackEventDataProcess,
    TrackEventQueueManager,
    PageLifecycleTrack,
    container,
    SERVICE_IDENTIFIER,
    EVENT_TYPE,
    DEFAULT_EVENT_CONFIG,
    DEFAULT_EVENT_NAME
}
