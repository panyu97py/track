import { NodePath, Visitor } from '@babel/core'
import { ImportDeclaration, Program } from '@babel/types'
import template from '@babel/template'
import { PluginState } from '../types'
import { getImportElements } from '../utils'

export const importInjectVisitor: Visitor = {
  Program: {
    exit (programPath: NodePath<Program>, state:PluginState) {
      // 获取所有当前的 import 元素
      const importElements = getImportElements(programPath)

      Array.from(state.dependRequire).forEach((dependRequireStr) => {
        // 生成 import ast
        const dependRequireAst = template.statement(dependRequireStr)() as ImportDeclaration
        const { source, specifiers } = dependRequireAst

        // 过滤掉已经存在的 specifiers
        const needInjectSpecifiers = (() => {
          if (!importElements.has(source.value)) return specifiers
          return specifiers.filter((specifier) => {
            return !importElements.get(source.value).get(specifier.type)?.has(specifier)
          })
        })()

        // 没有需要注入的 specifiers 就不注入
        if (!needInjectSpecifiers.length) return

        // 注入 import
        programPath.node.body.unshift({ ...dependRequireAst, specifiers: needInjectSpecifiers })
      })

      // 清空 state.dependRequire
      state.dependRequire.clear()
    }
  }
}
