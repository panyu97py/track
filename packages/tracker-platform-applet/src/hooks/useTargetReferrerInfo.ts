import { TrackPageContext } from '../context'
import { useContext } from 'react'

export const useTargetReferrerInfo = () => {
  const trackPageContext = useContext(TrackPageContext)
  return trackPageContext.referrerInfo || {}
}
