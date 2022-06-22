import {injectable, inject} from 'inversify'
import {EventCenter} from "./EventCenter";
import {TrackEventDataProcess} from "./TrackEventDataProcess";
import {TrackEventQueueManager} from './TrackEventQueueManager';
import {SERVICE_IDENTIFIER, DEFAULT_EVENT_CONFIG} from "../constants";
import type {PageLifecycleTrackInstance, TargetTrackConfig} from "../interface";

@injectable()
export class PageLifecycleTrack implements PageLifecycleTrackInstance {

    @inject(SERVICE_IDENTIFIER.TRACK_EVENT_DATA_PROCESS)
    private _trackEventDataProcess: TrackEventDataProcess;

    @inject(SERVICE_IDENTIFIER.TRACK_EVENT_QUEUE_MANAGER)
    private _trackEventQueueManager: TrackEventQueueManager;

    @inject(SERVICE_IDENTIFIER.EVENT_CENTER)
    private _eventCenter: EventCenter

    pageOnShow(): void {

        this._trackEventDataProcess.targetBeginExposure(DEFAULT_EVENT_CONFIG.PAGE_EXPOSURE_CONFIG)

        // todo 注册事件名需要唯一标识

        this._eventCenter.on('click', (trackConfig: TargetTrackConfig) => this._trackEventDataProcess.targetClick(trackConfig))

        this._eventCenter.on('beginExposure', (trackConfig: TargetTrackConfig) => this._trackEventDataProcess.targetBeginExposure(trackConfig))

        this._eventCenter.on('endExposure', (trackConfig: TargetTrackConfig) => this._trackEventDataProcess.targetEndExposure(trackConfig))

    }

    pageOnHide(): void {
        this._trackEventDataProcess.targetEndExposure(DEFAULT_EVENT_CONFIG.PAGE_EXPOSURE_CONFIG)

        // todo 注册事件名需要唯一标识

        this._eventCenter.off('click')

        this._eventCenter.off('beginExposure')

        this._eventCenter.off('endExposure')

        this._trackEventQueueManager.submitEventsQueue()
    }
}
