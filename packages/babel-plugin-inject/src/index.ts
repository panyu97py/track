import { declare } from '@babel/helper-plugin-utils'
import { Options } from './types'
import { injectImportVisitor, injectJsxAttributeVisitor } from './visitor'

export default declare<Options>(() => {
  return {
    name: 'babel-plugin-inject',
    visitor: {
      ...injectImportVisitor,
      ...injectJsxAttributeVisitor
    }
  }
})
