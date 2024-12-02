import babelPluginInject from '@trackerjs/babel-plugin-inject'

export default () => {
  return {
    plugins: [
      [babelPluginInject, { jsxAttributeInject: [] }]
    ]
  }
}
