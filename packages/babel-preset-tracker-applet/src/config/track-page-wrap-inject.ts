import { ExportDefaultWrapInjectOption } from '@trackerjs/babel-plugin-jsx-inject'
import { Opt } from '../types'
import { reduceAppletPages, removeFileExtension } from '../utils'
import template from '@babel/template'
import generate from '@babel/generator'

export const trackPageWrapInjectOption = (opt: Opt): ExportDefaultWrapInjectOption => {
  const { appConfig = {} } = opt

  const allPages = reduceAppletPages(appConfig)

  return {
    targetMatch: (_nodePath, state) => {
      if (!state.filename) return false
      const relativeFileName = state.filename.replace(`${process.cwd()}/src`, '')
      const relativeFileNameWithoutExtension = removeFileExtension(relativeFileName)
      return allPages.some(page => new RegExp(page).test(relativeFileNameWithoutExtension))
    },
    templateCode: (nodePath) => {
      const tempAst = template.expression(' wrapPageEvent(%%component%%)')({ component: nodePath.node.declaration })
      return generate(tempAst).code
    },
    dependRequire: ['import {wrapPageEvent} from \'@trackerjs/applet\'']
  }
}
