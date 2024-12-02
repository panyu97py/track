import babelPluginInject from '@trackerjs/babel-plugin-inject'
import { trackTargetWrapInject } from './config/track-target-wrap-inject'

export default () => {
  return {
    plugins: [
      [babelPluginInject, { jsxElementParentInject: [trackTargetWrapInject] }]
    ]
  }
}
