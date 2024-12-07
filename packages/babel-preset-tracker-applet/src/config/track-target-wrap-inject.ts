import { JsxElementParentInjectOption } from '@trackerjs/babel-plugin-inject'
import * as types from '@babel/types'
import { JSXAttribute, JSXIdentifier } from '@babel/types'

export const trackTargetWrapInject = (): JsxElementParentInjectOption => {
  return {
    targetMatch: (nodePath) => {
      const { attributes } = nodePath.node.openingElement
      return attributes.some((attribute) => {
        const trackEventNameKeys = ['eventClickName', 'eventEndExposureName']
        const isJSXAttribute = types.isJSXAttribute(attribute)
        const isJSXIdentifier = types.isJSXIdentifier((attribute as JSXAttribute).name)
        return isJSXAttribute && isJSXIdentifier && trackEventNameKeys.includes((attribute.name as JSXIdentifier).name)
      })
    },
    templateCode: '<TrackTargetWrap />',
    dependRequire: ['import {TrackTargetWrap} from \'@trackerjs/applet\'']
  }
}
