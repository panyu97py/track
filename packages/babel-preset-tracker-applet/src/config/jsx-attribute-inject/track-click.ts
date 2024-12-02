import { JsxAttributeInjectOption } from '@trackerjs/babel-plugin-inject'
import { NodePath } from '@babel/core'
import { JSXOpeningElement } from '@babel/types'

const trackClickTemplateCode = (path: NodePath<JSXOpeningElement>) => {
  console.log(path)
  return ''
}

export const trackClickInjectConfig: JsxAttributeInjectOption = {
  elementMatch: /.*/,
  attribute: 'onClick',
  templateCode: trackClickTemplateCode,
  dependRequire: ["import { trackTargetClick } from '@trackerjs/applet'"]
}
