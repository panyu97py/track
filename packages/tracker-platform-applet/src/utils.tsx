import React from 'react'
import { EventData } from '@trackerjs/core'
import { eventHooks } from './event-hooks'
import { TrackPageWrap } from './components'

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
