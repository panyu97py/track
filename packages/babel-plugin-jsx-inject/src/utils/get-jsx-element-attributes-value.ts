import { Expression, JSXAttribute, JSXSpreadAttribute, StringLiteral } from '@babel/types'
import * as types from '@babel/types'

const getJsxElementAttributeValue = (attribute: JSXAttribute | JSXSpreadAttribute) => {
  if (types.isJSXSpreadAttribute(attribute)) return attribute.argument
  if (types.isJSXAttribute(attribute)) {
    if (types.isStringLiteral(attribute.value)) return attribute.value
    if (types.isJSXExpressionContainer(attribute.value)) return attribute.value.expression
    return null
  }
}

const getJsxElementAttributeName = (attribute: JSXAttribute | JSXSpreadAttribute) => {
  if (types.isJSXSpreadAttribute(attribute)) return null
  if (types.isJSXAttribute(attribute)) {
    if (types.isJSXIdentifier(attribute.name)) return types.stringLiteral(attribute.name.name)
    if (types.isJSXNamespacedName(attribute.name)) {
      return types.stringLiteral(`${attribute.name.namespace.name}:${attribute.name.name.name}`)
    }
  }
  return null
}

export const getJsxElementAttributesValue = (attributes: Array<JSXAttribute | JSXSpreadAttribute>) => {
  const properties = attributes.reduce((result, item) => {
    if (types.isJSXSpreadAttribute(item)) return [...result, types.spreadElement(item.argument)]

    if (types.isJSXAttribute(item)) {
      const value = getJsxElementAttributeValue(item)
      const name = getJsxElementAttributeName(item)
      return [...result, types.objectProperty(name as StringLiteral, value as Expression)]
    }

    return result
  }, [])
  return types.objectExpression(properties)
}
