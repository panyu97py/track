import {Container} from 'inversify'
import {SERVICE_IDENTIFIER} from '../constants'
import {ConfigStore,EventStore} from "../store";
import {EventCenter, TrackEventDataProcess, TrackEventQueueManager, PageLifecycleTrack} from '../impl'
import type {
    TrackEventDataProcessInstance,
    TrackEventQueueManagerInterface,
    EventCenterInterface,
    PageLifecycleTrackInstance,
    ConfigStoreInterface,
    EventStoreInterface
} from '../interface'

const container = new Container()

container.bind<EventStoreInterface>(SERVICE_IDENTIFIER.EVENT_STORE).to(EventStore).inSingletonScope()

container.bind<ConfigStoreInterface>(SERVICE_IDENTIFIER.CONFIG_STORE).to(ConfigStore).inSingletonScope()

container.bind<EventCenterInterface>(SERVICE_IDENTIFIER.EVENT_CENTER).to(EventCenter).inSingletonScope()

container.bind<PageLifecycleTrackInstance>(SERVICE_IDENTIFIER.PAGE_LIFECYCLE_TRACK).to(PageLifecycleTrack).inTransientScope()

container.bind<TrackEventDataProcessInstance>(SERVICE_IDENTIFIER.TRACK_EVENT_DATA_PROCESS).to(TrackEventDataProcess).inTransientScope()

container.bind<TrackEventQueueManagerInterface>(SERVICE_IDENTIFIER.TRACK_EVENT_QUEUE_MANAGER).to(TrackEventQueueManager).inRequestScope()

export {container}
