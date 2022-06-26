import {DEFAULT_EVENT_CENTER_EVENT_NAME, SERVICE_IDENTIFIER} from '../constants';
import {CommonStore} from '../store';
import {container} from '../container'
import {EventCenter, TrackEventQueueManager} from "../impl";
import type {EventData, EventDataProcessType, TargetTrackConfig} from "../interface";

/**
 * 空函数
 */
export const noop = () => {
}

export const submitTrack = (trackConfig: TargetTrackConfig, type: EventDataProcessType, isImport?: boolean) => {
    const commonStore = container.get<CommonStore>(SERVICE_IDENTIFIER.COMMON_STORE)
    const eventCenter = container.get<EventCenter>(SERVICE_IDENTIFIER.EVENT_CENTER)
    eventCenter.trigger(commonStore.currentPageKey, trackConfig, type, isImport)
}

export const initGlobalEventQueueManager = () => {
    const trackEventQueueManager = container.get<TrackEventQueueManager>(SERVICE_IDENTIFIER.TRACK_EVENT_QUEUE_MANAGER)
    const eventCenter = container.get<EventCenter>(SERVICE_IDENTIFIER.EVENT_CENTER)
    eventCenter.on(DEFAULT_EVENT_CENTER_EVENT_NAME.GLOBAL_EVENT_LISTENER, (eventData: EventData, isImport?: boolean) => trackEventQueueManager.submitEvent(eventData, isImport))
}

export const submitEventData = (eventData: EventData, isImport?: boolean) => {
    const eventCenter = container.get<EventCenter>(SERVICE_IDENTIFIER.EVENT_CENTER)
    eventCenter.trigger(DEFAULT_EVENT_CENTER_EVENT_NAME.GLOBAL_EVENT_LISTENER, eventData, isImport)
}
