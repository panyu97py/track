import { Visitor } from '@babel/core'
import { JsxElementAttributeInjectOption, Options, PluginState, NodePath } from '../types'
import { JSXOpeningElement } from '@babel/types'
import * as types from '@babel/types'
import { getJsxElementNodeName } from '../utils'

import template from '@babel/template'

export const injectJsxElementAttributeVisitor: Visitor = {
  JSXOpeningElement: (jsxOpeningElementNodePath: NodePath<JSXOpeningElement>, state: PluginState) => {
    const { opts } = state
    const { jsxElementAttributeInject = [] } = opts as Options

    if (jsxOpeningElementNodePath._processed) return jsxOpeningElementNodePath.skip()

    jsxOpeningElementNodePath._processed = true

    jsxElementAttributeInject.forEach((jsxElementAttributeInjectOption: JsxElementAttributeInjectOption) => {
      const { elementMatch, attribute, templateCode, dependRequire = [] } = jsxElementAttributeInjectOption

      const { name, attributes: curAttributes = [] } = jsxOpeningElementNodePath.node

      // 获取元素名称
      const elementName = getJsxElementNodeName(name)

      // 判断元素是否匹配
      const isElementMatch = (() => {
        if (elementMatch instanceof RegExp) return elementMatch.test(elementName)
        if (typeof elementMatch === 'string') return elementMatch === elementName
        return elementMatch(jsxOpeningElementNodePath)
      })()

      // 生成模版代码字符串
      const templateCodeStr = typeof templateCode === 'string' ? templateCode : templateCode(jsxOpeningElementNodePath)

      // 若模版代码字符串为空或元素不匹配则返回
      if (!isElementMatch || !templateCodeStr) return

      // 删除原有属性
      const attributes = curAttributes.filter(item => {
        return !types.isJSXAttribute(item) || item.name.name === attribute
      })

      // 将模版代码转为 ast
      const templateCodeAst = template.expression(templateCodeStr, { plugins: ['jsx'] })() as any

      // 插入模版代码为属性值
      attributes.push(types.jsxAttribute(types.jsxIdentifier(attribute), templateCodeAst))

      // 设置依赖源
      dependRequire.forEach((item) => state.dependRequire.add(item))
    })
  }
}
