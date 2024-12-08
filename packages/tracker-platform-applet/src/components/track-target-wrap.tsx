import React from 'react'
import { useRouter } from '@tarojs/taro'
import { AnyFn, EventType, generateUUIDv4, noop } from '@trackerjs/core'
import { eventHooks } from '../event-hooks'
import { useTrackWrapContext } from '../context'
import { AppleTrackTargetConfig } from '../types'

interface ChildProps extends AppleTrackTargetConfig, Record<string, any> {
  onClick?: AnyFn

}

interface TrackTargetWrapProps {
  children: React.ReactElement<ChildProps>;
}

export const TrackTargetWrap: React.FC<TrackTargetWrapProps> = (props) => {
  const { children } = props

  const { props: childProps } = children

  // 获取当前页面路径
  const { path } = useRouter()

  // 获取目标元素的 referrerInfo
  const { referrerInfo = {} } = useTrackWrapContext()

  // 生成数据追踪 key
  const dataTrackKey = `${childProps.eventExposureName}-${childProps.eventTargetKey}`

  /**
   * 生成点击事件数据
   */
  const generateClickEventData = () => {
    const { eventClickName: eventName, extendData } = childProps
    const eventId = generateUUIDv4()
    const eventType = EventType.CLICK
    const eventBaseInfo = { eventId, eventType, eventName, extendData }
    const timeInfo = { startTime: Date.now(), endTime: Date.now(), duration: 0 }
    return { ...eventBaseInfo, ...referrerInfo, ...timeInfo, currentPagePath: path }
  }

  /**
   * 点击事件处理函数
   */
  const handleClick = (...args: any[]) => {
    const { eventClickName, onClick = noop } = childProps
    onClick(...args)
    if (!eventClickName) return
    const eventData = generateClickEventData()
    eventHooks.appendEventData.call(eventData)
  }

  return React.cloneElement(children, { ...childProps, dataTrackKey, onClick: handleClick })
}
