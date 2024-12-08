import Taro from '@tarojs/taro'
import { useRef } from 'react'
import { AppleTrackTargetConfig } from '../types'
import { AnyFn } from '@trackerjs/core'

const createSelectorQuery = () => {
  if (Taro.getEnv() !== Taro.ENV_TYPE.ALIPAY) return Taro.createSelectorQuery()

  // 支付宝小程序兼容
  const { page } = Taro.getCurrentInstance()

  return page?.createSelectorQuery?.()
}

export const useCalcTargetExposure = () => {
  // 事件配置 map
  const eventConfigMapRef = useRef<Map<string, AppleTrackTargetConfig>>(new Map())

  /**
   * 查询目标元素 dom 信息
   */
  const queryTargetDomInfo = async () => {
    const allEventConfig = Array.from(eventConfigMapRef.current.values())
    const allSelector = allEventConfig.filter(item => item).map(item => item.selfSelector)
    if (!allSelector.length) return
    const selectorStr = [...new Set(allSelector)].join(',')
    const opt = { dataset: true, rect: true, size: true }
    return new Promise(resolve => {
      createSelectorQuery()?.selectAll(selectorStr).fields(opt, resolve).exec()
    })
  }

  /**
   * 触发埋点计算
   */
  const triggerTrackCalc = async () => {
    const targetDomInfo = await queryTargetDomInfo()
    console.log({ targetDomInfo })
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

  const unregisterTrackTarget = (dataTrackKey: string) => {
    eventConfigMapRef.current.delete(dataTrackKey)
  }

  return { registerTrackTarget, unregisterTrackTarget, triggerTrackCalc, calcTriggerProxy }
}
