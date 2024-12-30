import { NodePath as OriginNodePath, PluginPass } from '@babel/core'
import { ExportDefaultDeclaration, JSXElement, JSXOpeningElement } from '@babel/types'

export interface NodePath<T> extends OriginNodePath<T> {
  _processed?: boolean
}

export interface PluginState extends PluginPass {
  dependRequire: Set<string>
}

export type TargetMatchFn<T> = (nodePath: NodePath<T>, state:PluginState) => boolean

export type TemplateCodeFn<T> = (nodePath: NodePath<T>, state:PluginState) => string

export type TargetMatch<T> = string | RegExp | TargetMatchFn<T>;

export type TemplateCode<T> = string | TemplateCodeFn<T>

export interface JsxElementAttributeInjectOption {
  attribute: string,
  targetMatch: TargetMatch<JSXOpeningElement>,
  templateCode: TemplateCode<JSXOpeningElement>,
  dependRequire: string[]
}

export interface JsxElementParentInjectOption {
  targetMatch: TargetMatch<JSXElement>,
  templateCode: TemplateCode<JSXElement>,
  dependRequire: string[]
}

export interface ExportDefaultWrapInjectOption {
  targetMatch: TargetMatchFn<ExportDefaultDeclaration>,
  templateCode: TemplateCode<ExportDefaultDeclaration>,
  dependRequire: string[]
}

export interface Options {
  jsxElementAttributeInject?: JsxElementAttributeInjectOption[]
  jsxElementParentInject?: JsxElementParentInjectOption[]
  exportDefaultWrapInject?: ExportDefaultWrapInjectOption[]
}
