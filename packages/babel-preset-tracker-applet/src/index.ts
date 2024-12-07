import babelPluginInject from '@trackerjs/babel-plugin-inject'
import { trackTargetWrapInject } from './config/track-target-wrap-inject'
import { trackPageWrapInjectOption } from './config/track-page-wrap-inject'
import { Opt } from './types'

export default (opt: Opt) => {
  return {
    plugins: [
      [babelPluginInject, {
        jsxElementParentInject: [
          trackTargetWrapInject(),
          trackPageWrapInjectOption(opt)
        ]
      }]
    ]
  }
}
