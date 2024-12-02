import React from 'react'
import { trackTargetClick } from '../utils'
import { noop } from '@trackerjs/core'

interface ChildProps extends Record<string, any> {
  onClick?: (...args:any[]) => void,
}

interface TrackTargetWrapProps {
  children: React.ReactElement<ChildProps>;
}

export const TrackTargetWrap: React.FC<TrackTargetWrapProps> = (props) => {
  const { children } = props
  const { props: childProps } = props.children

  const handleClick = (...args: any[]) => {
    const { eventClickName, extendData, onClick = noop } = childProps
    onClick(...args)
    if (!eventClickName) return
    trackTargetClick({ eventClickName, extendData })
  }

  return React.cloneElement(children, { ...childProps, onClick: handleClick })
}
