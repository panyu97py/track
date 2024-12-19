import { Program } from '@babel/types'
import { NodePath } from '@babel/core'

/**
 * 获取引入的元素数据，按 source、type、specifier 归类
 * @param programPath
 */
export const getImportElements = (programPath:NodePath<Program>) => {
  const importElement = new Map()
  programPath.traverse({
    ImportDeclaration (importDeclarationPath) {
      const { source, specifiers } = importDeclarationPath.node

      // 按 source 归类 type
      if (!importElement.has(source.value)) importElement.set(source.value, new Map())
      const tempObj = importElement.get(source.value)

      // 按 type 归类 specifier
      specifiers.forEach((specifier) => {
        const { type } = specifier
        if (!tempObj.has(type)) tempObj.set(type, new Set())
        tempObj.get(type).add(specifier.local.name)
      })
    }
  })
  return importElement
}
