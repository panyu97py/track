import { DomInfo, TrackTargetDomInfo } from '../types'

export const checkTargetVisible = (trackTargetDomInfo: TrackTargetDomInfo, relativeDomInfo: DomInfo): boolean => {
  if (!relativeDomInfo || !trackTargetDomInfo) return false

  // 解构容器元素的位置信息
  const {
    top: relativeTop,
    left: relativeLeft,
    width: relativeWidth,
    height: relativeHeight
  } = relativeDomInfo

  // 解构目标元素的位置信息
  const {
    top: targetTop,
    left: targetLeft,
    width: targetWidth,
    height: targetHeight
  } = trackTargetDomInfo

  // 计算目标元素相对于容器的位移
  const offsetTop = targetTop - relativeTop

  const offsetLeft = targetLeft - relativeLeft

  // 判断元素在垂直方向是否可见
  const isVerticallyVisible = offsetTop < relativeHeight && offsetTop + targetHeight > 0

  // 判断元素在水平方向是否可见
  const isHorizontallyVisible = offsetLeft < relativeWidth && offsetLeft + targetWidth > 0

  // 判断元素的宽高是否大于0
  const hasSize = targetWidth * targetHeight > 0

  // 返回元素是否可见：垂直可见 && 水平可见 && 有大小
  return isVerticallyVisible && isHorizontallyVisible && hasSize
}

export const filterVisibleTarget = (trackTargetDomInfos: TrackTargetDomInfo[], relativeDomInfo: DomInfo) => {
  return trackTargetDomInfos?.filter(item => checkTargetVisible(item, relativeDomInfo))
}
