import { declare } from '@babel/helper-plugin-utils'
import { Options } from './types'
import { importInjectVisitor, jsxAttributeInjectVisitor } from './visitor'

export default declare<Options>(() => {
  return {
    name: 'babel-plugin-inject',
    visitor: {
      ...importInjectVisitor,
      ...jsxAttributeInjectVisitor
    }
  }
})
