import React, { useContext } from 'react'
import { ReferrerInfo } from '../types'
import { EventConfig } from '@trackerjs/core'

export interface TrackWrapContextValue {
  referrerInfo: ReferrerInfo
  registerTrackTarget: (dataTrackKey: string, eventConfig: EventConfig) => void
  unregisterTrackTarget: (dataTrackKey: string) => void
}

export const TrackWrapContext = React.createContext<Partial<TrackWrapContextValue>>({})

export const useTrackWrapContext = () => useContext(TrackWrapContext)
