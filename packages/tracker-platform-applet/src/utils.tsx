import React from 'react'
import { EventConfig, EventData } from '@trackerjs/core'
import { eventHooks } from './event-hooks'
import { TrackPageWrap } from './components'

export const trackTargetEndExposure = (eventConfig: EventConfig) => {
  eventHooks.trackTargetEndExposure.call(eventConfig)
}

export const trackTargetBeginExposure = (eventConfig: EventConfig) => {
  eventHooks.trackTargetEndExposure.call(eventConfig)
}

export const appendEventData = (eventData: EventData) => {
  eventHooks.appendEventData.call(eventData)
}

export const wrapPageEvent = (PageComponent: React.ComponentType) => {
  const WrapComponent: React.FC = () => (
    <TrackPageWrap>
      <PageComponent/>
    </TrackPageWrap>
  )
  return WrapComponent
}
