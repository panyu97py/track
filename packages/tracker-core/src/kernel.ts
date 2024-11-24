import { AnyFn, Config, Plugin, PluginContext, Preset } from './types'
import { PluginCtx } from './plugin'

export class Kernel {
  /**
   * 实例
   * @private
   */
  private static kernelInstance: Kernel

  /**
   * 基础配置
   */
  private config: Config

  /**
   * 注册方法
   */
  public methods: Map<string, AnyFn[]>

  public static init (config: Config): Kernel {
    if (!this.kernelInstance) {
      this.kernelInstance = new Kernel()
      this.kernelInstance.init(config)
    }
    return this.kernelInstance
  }

  /**
   * 初始化
   */
  private init (config: Config) {
    this.config = config
    this.initPlugins(this.config.plugins || [])
    this.initPresets(this.config.presets || [])
  }

  /**
   * 初始化插件
   * @param plugins
   * @private
   */
  private initPlugins (plugins: ReturnType<Plugin>[]) {
    const pluginCtx = new PluginCtx(this) as PluginContext
    plugins.forEach(plugin => plugin(pluginCtx))
  }

  /**
   * 初始化预设
   * @param presets
   * @private
   */
  private initPresets (presets: ReturnType<Preset>[]) {
    const pluginCtx = new PluginCtx(this) as PluginContext
    presets.forEach(preset => {
      const { plugins } = preset(pluginCtx)
      this.initPlugins(plugins)
    })
  }
}
