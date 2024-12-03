import { useDidHide, useDidShow, useRouter } from '@tarojs/taro'
import { eventHooks } from '../event-hooks'
import React, { ReactNode } from 'react'

interface TrackPageWrapProps {
  children: ReactNode
}

export const TrackPageWrap: React.FC<TrackPageWrapProps> = (props) => {
  const { children } = props

  const { path } = useRouter()

  useDidShow(() => eventHooks.trackPageBeginExposure.call(path))

  useDidHide(() => eventHooks.trackPageEndExposure.call(path))

  return <>{children}</>
}
