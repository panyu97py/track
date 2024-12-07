import { declare } from '@babel/helper-plugin-utils'
import { Options } from './types'
import {
  injectImportVisitor,
  injectExportDefaultWrapVisitor,
  injectJsxElementAttributeVisitor,
  injectJsxElementParentVisitor
} from './visitor'

export * from './utils'
export * from './types'

export default declare<Options>(() => {
  return {
    name: 'babel-plugin-inject',
    visitor: {
      ...injectImportVisitor,
      ...injectJsxElementParentVisitor,
      ...injectJsxElementAttributeVisitor,
      ...injectExportDefaultWrapVisitor
    }
  }
})
