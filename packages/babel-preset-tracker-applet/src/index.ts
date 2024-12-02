import babelPluginInject from '@trackerjs/babel-plugin-inject'
import { trackClickInjectConfig } from './config/jsx-attribute-inject'

export default () => {
  return {
    plugins: [
      [babelPluginInject, { jsxAttributeInject: [trackClickInjectConfig] }]
    ]
  }
}
