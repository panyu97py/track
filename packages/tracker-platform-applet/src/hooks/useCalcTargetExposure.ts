import { useEffect, useRef } from 'react'
import { AppleTrackTargetConfig, DomInfo, ReferrerInfo, TrackTargetDomInfo } from '../types'
import { AnyFn, EventType, generateUUIDv4 } from '@trackerjs/core'
import { createSelectorQuery, filterVisibleTarget } from '../utils'
import { eventHooks } from '../event-hooks'
import { useDebouncedCallback } from 'use-debounce'
import { useDidHide, useRouter } from '@tarojs/taro'

export const useCalcTargetExposure = (queryRelativeDomInfo: () => Promise<DomInfo>, referrerInfo:ReferrerInfo) => {
  // 事件配置 map
  const eventConfigMapRef = useRef<Map<string, AppleTrackTargetConfig>>(new Map())

  // 元素开始曝光时间map
  const exposureStartTimeMapRef = useRef<Map<string, number>>(new Map())

  const { path } = useRouter()

  /**
   * 查询目标元素 dom 信息
   */
  const queryTargetDomInfo = async () => {
    const allEventConfig = Array.from(eventConfigMapRef.current.values())
    const allSelector = allEventConfig.filter(item => item).map(item => item.selfSelector)
    if (!allSelector.length) return
    const selectorStr = [...new Set(allSelector)].join(',')
    const opt = { dataset: true, rect: true, size: true }
    return new Promise<TrackTargetDomInfo[]>(resolve => {
      createSelectorQuery()?.selectAll(selectorStr).fields(opt, resolve).exec()
    })
  }

  /**
   * 元素开始曝光
   * @param trackKey
   */
  const targetBeginExposure = (trackKey: string) => {
    exposureStartTimeMapRef.current.set(trackKey, Date.now())
  }

  /**
   * 元素结束曝光
   * @param trackKey
   */
  const targetEndExposure = useDebouncedCallback((trackKey: string) => {
    const eventConfig = eventConfigMapRef.current.get(trackKey)
    const { eventExposureName: eventName, extendData } = eventConfig || {}
    const startTime = exposureStartTimeMapRef.current.get(trackKey)
    if (!eventConfig || !eventName || !startTime) return
    const eventId = generateUUIDv4()
    const eventType = EventType.EXPOSURE
    const baseEventData = { eventId, eventName, eventType, extendData }
    const timeInfo = { startTime, endTime: Date.now(), duration: Date.now() - startTime }
    const finalEventData = { ...baseEventData, ...timeInfo, ...referrerInfo, currentPagePath: path }
    exposureStartTimeMapRef.current.delete(trackKey)
    eventHooks.appendEventData.call(finalEventData)
  }, 500, { leading: true, trailing: false })

  /**
   * 触发埋点计算
   */
  const triggerTrackCalc = async () => {
    const [targetDomInfo, relativeDomInfo] = await Promise.all([queryTargetDomInfo(), queryRelativeDomInfo()])

    // 本次计算可见的元素
    const curVisibleTarget = filterVisibleTarget(targetDomInfo || [], relativeDomInfo)

    // 本次计算可见的元素 key
    const curVisibleTargetTrackKeys = curVisibleTarget.map(item => item.dataset?.trackKey)

    // 上次计算可见的元素 key
    const preVisibleTargetTrackKeys = Array.from(exposureStartTimeMapRef.current.keys())

    // 本次计算开始曝光的元素 key
    const beginExposureTargetTrackKeys = curVisibleTargetTrackKeys?.filter(item => !preVisibleTargetTrackKeys.includes(item))

    // 本次计算结束曝光的元素 key
    const endExposureTargetTrackKeys = preVisibleTargetTrackKeys.filter(item => !curVisibleTargetTrackKeys.includes(item))

    // 生成元素开始曝光数据
    beginExposureTargetTrackKeys.forEach((trackKey) => targetBeginExposure(trackKey))

    // 生成元素结束曝光数据
    endExposureTargetTrackKeys.forEach((trackKey) => targetEndExposure(trackKey))
  }

  /**
   * 代理埋点计算触发器
   * @param effect
   */
  const calcTriggerProxy = <T extends AnyFn> (effect: T) => {
    return (...args: Parameters<T>): ReturnType<T> => {
      triggerTrackCalc()
      return effect(...args)
    }
  }

  /**
   * 注册埋点元素配置
   */
  const registerTrackTarget = calcTriggerProxy((dataTrackKey: string, eventConfig: AppleTrackTargetConfig) => {
    eventConfigMapRef.current.set(dataTrackKey, eventConfig)
  })

  /**
   * 注销埋点元素配置
   * @param dataTrackKey
   */
  const unregisterTrackTarget = (dataTrackKey: string) => {
    targetEndExposure(dataTrackKey)
    eventConfigMapRef.current.delete(dataTrackKey)
  }

  const allTargetEndExposure = () => {
    // 上次计算可见的元素 key
    const preVisibleTargetTrackKeys = Array.from(exposureStartTimeMapRef.current.keys())

    // 生成元素结束曝光数据
    preVisibleTargetTrackKeys.forEach((trackKey) => targetEndExposure(trackKey))
  }

  useDidHide(() => allTargetEndExposure())

  useEffect(() => {
    return () => allTargetEndExposure()
  }, [])

  return {
    registerTrackTarget,
    unregisterTrackTarget,
    triggerTrackCalc,
    calcTriggerProxy
  }
}
