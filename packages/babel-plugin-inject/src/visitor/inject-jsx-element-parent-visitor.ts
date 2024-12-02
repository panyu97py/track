import { Visitor } from '@babel/core'
import * as types from '@babel/types'
import type { JSXElement } from '@babel/types'
import { JsxElementParentInjectOption, NodePath, Options, PluginState } from '../types'
import { getJsxElementNodeName } from '../utils'
import template from '@babel/template'

export const injectJsxElementParentVisitor: Visitor = {
  JSXElement: (jsxElementNodePath: NodePath<JSXElement>, state: PluginState) => {
    const { opts } = state

    const { jsxElementParentInject = [] } = opts as Options

    if (jsxElementNodePath._processed) return jsxElementNodePath.skip()

    jsxElementNodePath._processed = true

    jsxElementParentInject.forEach((jsxElementParentInjectOption:JsxElementParentInjectOption) => {
      const { elementMatch, templateCode, dependRequire = [] } = jsxElementParentInjectOption

      // 获取元素名称
      const elementName = getJsxElementNodeName(jsxElementNodePath.node)

      // 生成模版代码字符串
      const templateCodeStr = typeof templateCode === 'string' ? templateCode : templateCode(jsxElementNodePath)

      // 若模版代码字符串为空则跳过
      if (!templateCodeStr) return jsxElementNodePath.skip()

      // 插入节点的 ast
      const parentElementAst = template.expression(templateCodeStr, { plugins: ['jsx'] })() as JSXElement

      // 若父节点已经是目标节点则跳过
      const isProcessed = (() => {
        const { node: parentNode } = jsxElementNodePath.parentPath
        if (!types.isJSXElement(parentNode)) return false
        const curParentElementName = getJsxElementNodeName(parentNode)
        const nextParentElementName = getJsxElementNodeName(parentElementAst)
        return curParentElementName === nextParentElementName
      })()

      // 判断元素是否匹配
      const isElementMatch = (() => {
        if (elementMatch instanceof RegExp) return elementMatch.test(elementName)
        if (typeof elementMatch === 'string') return elementMatch === elementName
        return elementMatch(jsxElementNodePath)
      })()

      if (isProcessed || !isElementMatch) return jsxElementNodePath.skip()

      // 将目标节点作为插入节点的字节点
      parentElementAst.children = [jsxElementNodePath.node]

      // 替换节点
      jsxElementNodePath.replaceWith(parentElementAst)

      // 若依赖源不存在则初始化
      if (!state.dependRequire) state.dependRequire = new Set()

      // 设置依赖源
      dependRequire.forEach((item) => state.dependRequire.add(item))
    })
  }
}
