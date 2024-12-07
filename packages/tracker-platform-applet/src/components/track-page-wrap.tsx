import { useDidHide, useDidShow, useRouter, usePageScroll, useUnload, useLoad } from '@tarojs/taro'
import { useDebouncedCallback } from 'use-debounce'
import { eventHooks } from '../event-hooks'
import React, { ReactNode } from 'react'

interface TrackPageWrapProps {
  children: ReactNode
}

export const TrackPageWrap: React.FC<TrackPageWrapProps> = (props) => {
  const { children } = props

  const { path, params } = useRouter()

  const triggerTrackPageBeginExposure = useDebouncedCallback(() => {
    return eventHooks.trackPageBeginExposure.call(path, params)
  }, 500, { leading: true, trailing: false })

  const triggerTrackPageEndExposure = useDebouncedCallback(() => {
    return eventHooks.trackPageEndExposure.call(path, params)
  }, 500, { leading: true, trailing: false })

  useLoad(() => triggerTrackPageBeginExposure())

  useDidShow(() => triggerTrackPageBeginExposure())

  useDidHide(() => triggerTrackPageEndExposure())

  useUnload(() => triggerTrackPageEndExposure())

  usePageScroll(() => eventHooks.pageScroll.call(path))

  return <>{children}</>
}
