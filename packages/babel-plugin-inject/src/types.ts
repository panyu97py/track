import { NodePath, PluginPass } from '@babel/core'
import { JSXOpeningElement } from '@babel/types'

export type ElementMatch<T> = string | RegExp | ((nodePath: NodePath<T>) => boolean);
export type TemplateCode<T> = string | ((path: NodePath<T>) => string)

export interface PluginState extends PluginPass {
  dependRequire: Set<string>
}

export interface JsxAttributeInjectOption {
  attribute: string,
  elementMatch: ElementMatch<JSXOpeningElement>,
  templateCode: TemplateCode<JSXOpeningElement>,
  dependRequire: string[]
}

export interface Options {
  jsxAttributeInject?: JsxAttributeInjectOption[]
}
