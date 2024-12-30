import { CallExpression, Identifier } from '@babel/types'
import * as types from '@babel/types'

export const getCallExpressionName = (node: CallExpression) => {
  // 通过访问 callee 获取函数调用部分
  const { callee } = node

  //  callee 为标识符,返回标识符的名称
  if (types.isIdentifier(callee)) return callee.name

  // 如果是成员调用（例如 obj.method()）
  if (types.isMemberExpression(callee)) {
    const { object, property } = callee
    return `${getCallExpressionName(object as CallExpression)}.${(property as Identifier).name}`
  }
  // 默认返回空
  return null
}
