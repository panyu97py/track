import * as types from '@babel/types'

import type { JSXIdentifier, JSXMemberExpression, JSXNamespacedName } from '@babel/types'

type JSXNode = JSXIdentifier | JSXMemberExpression | JSXNamespacedName;

export const getJsxElementNodeName = (node: JSXNode) => {
  // JSXIdentifier 类型如： <div/>
  if (types.isJSXIdentifier(node)) return node.name

  // JSXIdentifier 类型如： <svg:xlink/>
  if (types.isJSXNamespacedName(node)) return `${node.namespace.name}:${node.name.name}`

  // JSXMemberExpression 类型如：<Component.A/>
  if (types.isJSXMemberExpression(node)) return `${getJsxElementNodeName(node.object)}.${node.property.name}`

  // 默认返回空
  return null
}
