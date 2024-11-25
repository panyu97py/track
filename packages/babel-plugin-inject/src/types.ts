import { NodePath, PluginPass } from '@babel/core'
import { JSXOpeningElement } from '@babel/types'

export interface PluginState extends PluginPass {
  dependRequire: Set<string>
}

export interface JsxAttributeInjectOption {
  elementMatch: string | RegExp;
  attribute: string,
  template: string | ((path: NodePath<JSXOpeningElement>) => string),
  dependRequire: string[]
}

export interface Options {
  jsxAttributeInject?: JsxAttributeInjectOption[]
}
