import React from 'react'
import { TrackWrapContext, useTrackWrapContext } from '../context'
import { useCalcTargetExposure } from '../hooks'

type ChildProps = Record<string, any>

interface TrackTargetContainerWrapProps {
  calcTrigger?: string | string[]
  children: React.ReactElement<ChildProps>;
}

export const TrackContainerWrap: React.FC<TrackTargetContainerWrapProps> = (props) => {
  const { children, calcTrigger = [] } = props

  const { props: childProps } = children

  // 获取目标元素的 referrerInfo
  const { referrerInfo = {} } = useTrackWrapContext()

  // 计算元素曝光
  const { registerTrackTarget, calcTriggerProxy } = useCalcTargetExposure()

  // 元素曝光计算触发器
  const finalCalcTrigger = Array.isArray(calcTrigger) ? calcTrigger : [calcTrigger]

  // 元素曝光计算触发器事件代理
  const proxyEvents = finalCalcTrigger.reduce((result, item) => {
    return { ...result, [item]: calcTriggerProxy(childProps[item]) }
  }, {})

  return (
    <TrackWrapContext.Provider value={{ referrerInfo, registerTrackTarget }}>
      {React.cloneElement(children, proxyEvents)}
    </TrackWrapContext.Provider>
  )
}
