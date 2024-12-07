import babelPluginInject from '@trackerjs/babel-plugin-inject'
import { trackTargetWrapInject } from './config/track-target-wrap-inject'
import { trackPageWrapInjectOption } from './config/track-page-wrap-inject'
import { Opt } from './types'

export * from './utils'

export default (_: any, opt: Opt) => {
  return {
    plugins: [
      [babelPluginInject, {
        jsxElementParentInject: [trackTargetWrapInject()],
        exportDefaultWrapInject: [trackPageWrapInjectOption(opt)]
      }]
    ]
  }
}
