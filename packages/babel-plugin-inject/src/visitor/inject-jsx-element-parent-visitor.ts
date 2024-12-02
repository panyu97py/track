import { Visitor } from '@babel/core'
import { JSXElement } from '@babel/types'
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

      const { openingElement } = jsxElementNodePath.node

      const { name } = openingElement

      // 获取元素名称
      const elementName = getJsxElementNodeName(name)

      // 判断元素是否匹配
      const isElementMatch = (() => {
        if (elementMatch instanceof RegExp) return elementMatch.test(elementName)
        if (typeof elementMatch === 'string') return elementMatch === elementName
        return elementMatch(jsxElementNodePath)
      })()

      // 生成模版代码字符串
      const templateCodeStr = typeof templateCode === 'string' ? templateCode : templateCode(jsxElementNodePath)

      // 若模版代码字符串为空或元素不匹配则返回
      if (!isElementMatch || !templateCodeStr) return

      // 插入节点的 ast
      const parentElementAst = template.expression(templateCodeStr, { plugins: ['jsx'] })() as JSXElement

      // 将目标节点作为插入节点的字节点
      parentElementAst.children = [jsxElementNodePath.node]

      // 替换节点
      jsxElementNodePath.replaceWith(parentElementAst)

      // 设置依赖源
      dependRequire.forEach((item) => state.dependRequire.add(item))
    })
  }
}
