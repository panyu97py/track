import { Visitor } from '@babel/core'

export const jsxAttributeInjectVisitor: Visitor = {
  JSXOpeningElement: (jsxOpeningElementNodePath) => {
    console.log(jsxOpeningElementNodePath)
  }
}
