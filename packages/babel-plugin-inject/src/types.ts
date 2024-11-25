import { NodePath } from '@babel/core'
import { JSXOpeningElement } from '@babel/types'

export interface JsxAttributeInjectOption {
  elementMatch: string | RegExp;
  attribute: string,
  template: string | ((path: NodePath<JSXOpeningElement>) => string),
}

export interface Options {
  jsxAttributeInject?: JsxAttributeInjectOption[]
}
