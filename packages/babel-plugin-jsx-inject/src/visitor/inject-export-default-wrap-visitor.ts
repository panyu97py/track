import { Visitor } from '@babel/core'
import { ExportDefaultDeclaration } from '@babel/types'
import { NodePath, Options, PluginState } from '../types'
import template from '@babel/template'
import * as types from '@babel/types'
import { getCallExpressionName } from '../utils'

export const injectExportDefaultWrapVisitor: Visitor = {
  ExportDefaultDeclaration: (exportDefaultDeclarationNodePath: NodePath<ExportDefaultDeclaration>, state: PluginState) => {
    const { opts } = state
    const { exportDefaultWrapInject = [] } = opts as Options

    if (exportDefaultDeclarationNodePath._processed) return

    exportDefaultDeclarationNodePath._processed = true

    exportDefaultWrapInject.forEach(exportDefaultWrapInjectOption => {
      const {
        targetMatch,
        templateCode,
        dependRequire = []
      } = exportDefaultWrapInjectOption

      const templateCodeStr = (() => {
        if (typeof templateCode === 'string') return templateCode
        return templateCode(exportDefaultDeclarationNodePath, state)
      })()

      // 若模版代码字符串为空则跳过
      if (!templateCodeStr) return

      // 将模版代码转为 ast
      const templateCodeAst = template.expression(templateCodeStr)() as any

      // 若父节点已经是目标节点则跳过
      const isProcessed = (() => {
        const { declaration } = exportDefaultDeclarationNodePath.node
        if (!types.isCallExpression(declaration)) return false
        const curCallExpressionName = getCallExpressionName(declaration)
        const nextCallExpressionName = getCallExpressionName(templateCodeAst)
        return curCallExpressionName === nextCallExpressionName
      })()

      // 判断元素是否匹配
      const isTargetMatch = targetMatch(exportDefaultDeclarationNodePath, state)

      if (isProcessed || !isTargetMatch) return

      // 将模版代码转为 ast
      exportDefaultDeclarationNodePath.node.declaration = templateCodeAst

      // 若依赖源不存在则初始化
      if (!state.dependRequire) state.dependRequire = new Set()

      // 设置依赖源
      dependRequire.forEach((item) => state.dependRequire.add(item))
    })
  }
}
