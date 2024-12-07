import React from 'react'
import { ReferrerInfo } from '../types'

export interface TrackPageContextValue {
  referrerInfo: ReferrerInfo
}

export const TrackPageContext = React.createContext<Partial<TrackPageContextValue>>({})
