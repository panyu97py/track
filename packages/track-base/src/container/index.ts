import {Container} from 'inversify'
import {SERVICE_IDENTIFIER} from '../constants'
import {EventCenter, TrackEventDataProcess, TrackEventQueueManager} from '../impl'
import type {TrackEventDataProcessInstance, TrackEventQueueManagerInterface, EventCenterInterface} from '../interface'

const container = new Container()

container.bind<EventCenterInterface>(SERVICE_IDENTIFIER.EVENT_CENTER).to(EventCenter).inSingletonScope()

container.bind<TrackEventDataProcessInstance>(SERVICE_IDENTIFIER.TRACK_EVENT_DATA_PROCESS).to(TrackEventDataProcess).inTransientScope()

container.bind<TrackEventQueueManagerInterface>(SERVICE_IDENTIFIER.TRACK_EVENT_QUEUE_MANAGER).to(TrackEventQueueManager).inRequestScope()

export default container
