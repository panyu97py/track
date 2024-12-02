import { NodePath as OriginNodePath, PluginPass } from '@babel/core'
import { JSXElement, JSXOpeningElement } from '@babel/types'

export interface NodePath<T> extends OriginNodePath<T> {
  _processed?: boolean
}

export type ElementMatch<T> = string | RegExp | ((nodePath: NodePath<T>) => boolean);
export type TemplateCode<T> = string | ((path: NodePath<T>) => string)

export interface PluginState extends PluginPass {
  dependRequire: Set<string>
}

export interface JsxElementAttributeInjectOption {
  attribute: string,
  elementMatch: ElementMatch<JSXOpeningElement>,
  templateCode: TemplateCode<JSXOpeningElement>,
  dependRequire: string[]
}

export interface JsxElementParentInjectOption {
  elementMatch: ElementMatch<JSXElement>,
  templateCode: TemplateCode<JSXElement>,
  dependRequire: string[]
}

export interface Options {
  jsxElementAttributeInject?: JsxElementAttributeInjectOption[]
  jsxElementParentInject?: JsxElementParentInjectOption[]
}
