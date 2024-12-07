import { Visitor } from '@babel/core'
import { ExportDefaultDeclaration } from '@babel/types'
import { NodePath, Options, PluginState } from '../types'
import template from '@babel/template'

export const injectExportDefaultWrapVisitor: Visitor = {
  ExportDefaultDeclaration: (exportDefaultDeclarationNodePath: NodePath<ExportDefaultDeclaration>, state: PluginState) => {
    const { opts } = state
    const { exportDefaultWrapInject = [] } = opts as Options

    if (exportDefaultDeclarationNodePath._processed) return

    exportDefaultDeclarationNodePath._processed = true

    exportDefaultWrapInject.forEach(exportDefaultWrapInjectOption => {
      const { targetMatch, templateCode, dependRequire = [] } = exportDefaultWrapInjectOption

      // 判断元素是否匹配
      const isTargetMatch = targetMatch(exportDefaultDeclarationNodePath)

      const templateCodeStr = typeof templateCode === 'string' ? templateCode : templateCode(exportDefaultDeclarationNodePath)

      if (!isTargetMatch || !templateCodeStr) return

      // 将模版代码转为 ast
      exportDefaultDeclarationNodePath.node.declaration = template.expression(templateCodeStr)() as any

      // 若依赖源不存在则初始化
      if (!state.dependRequire) state.dependRequire = new Set()

      // 设置依赖源
      dependRequire.forEach((item) => state.dependRequire.add(item))
    })
  }
}
