import { Visitor } from '@babel/core'

export const importInjectVisitor: Visitor = {
  ImportDeclaration: (importDeclarationNodePath) => {}
}
