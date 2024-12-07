import { useDidHide, useDidShow, useRouter, usePageScroll, useUnload, useLoad } from '@tarojs/taro'
import { BaseEventName, EventType, generateUUIDv4 } from '@trackerjs/core'
import React, { ReactNode, useMemo, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { eventHooks } from '../event-hooks'
import { usePageReferrerInfo } from '../hooks'
import { TrackPageContext } from '../context'
import { Current } from '../constants'

interface TrackPageWrapProps {
  children: ReactNode
}

export const TrackPageWrap: React.FC<TrackPageWrapProps> = (props) => {
  const { children } = props

  const { path, params } = useRouter()

  const referrerInfo = usePageReferrerInfo()

  // 页面曝光开始时间（由于子组件不依赖该字段故采用 ref 实现，减少 rerender）
  const pageExposureStartTime = useRef<number>(0)

  // 页面曝光事件id（由于子组件依赖该字段故采用 state 实现）
  const [pageExposureEventId, setPageExposureEventId] = useState<string>('')

  const targetReferrerInfo = useMemo(() => {
    return { referrerEventId: pageExposureEventId, referrerPagePath: referrerInfo.referrerPagePath }
  }, [pageExposureEventId, referrerInfo])

  const generatePageExposureEventData = () => {
    const eventId = pageExposureEventId
    const eventType = EventType.EXPOSURE
    const eventName = BaseEventName.PAGE_EXPOSURE
    const extendData = params
    const eventBaseInfo = { eventId, eventType, eventName, extendData }
    const startTime = pageExposureStartTime.current
    const timeInfo = { startTime, endTime: Date.now(), duration: Date.now() - startTime }
    return { ...eventBaseInfo, ...referrerInfo, ...timeInfo, currentPagePath: path }
  }

  /**
   * 触发页面开始曝光
   */
  const triggerTrackPageBeginExposure = useDebouncedCallback(() => {
    const tempPageExposureEventId = generateUUIDv4()
    Current.pageReferrerInfo = { referrerPagePath: path, referrerEventId: tempPageExposureEventId }
    setPageExposureEventId(tempPageExposureEventId)
    pageExposureStartTime.current = Date.now()
  }, 500, { leading: true, trailing: false })

  /**
   * 触发页面结束曝光
   */
  const triggerTrackPageEndExposure = useDebouncedCallback(() => {
    const pageExposureEventData = generatePageExposureEventData()
    return eventHooks.appendEventData.call(pageExposureEventData)
  }, 500, { leading: true, trailing: false })

  useLoad(() => triggerTrackPageBeginExposure())

  useDidShow(() => triggerTrackPageBeginExposure())

  useDidHide(() => triggerTrackPageEndExposure())

  useUnload(() => triggerTrackPageEndExposure())

  usePageScroll(() => eventHooks.pageScroll.call(path))

  return (
    <TrackPageContext.Provider value={{ referrerInfo: targetReferrerInfo }}>
      {children}
    </TrackPageContext.Provider>
  )
}
