import Taro from '@tarojs/taro'

export const createSelectorQuery = () => {
  if (Taro.getEnv() !== Taro.ENV_TYPE.ALIPAY) return Taro.createSelectorQuery()

  // 支付宝小程序兼容
  const { page } = Taro.getCurrentInstance()

  return page?.createSelectorQuery?.()
}
