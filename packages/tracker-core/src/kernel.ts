import { AnyFn, Config, Plugin, Preset } from './types'
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
  private readonly config: Config

  /**
   * 注册方法
   */
  public methods: Map<string, AnyFn[]>

  /**
   * 创建实例
   * @param config
   */
  public static create (config: Config) {
    this.kernelInstance = new Kernel(config)
    this.kernelInstance.init()
  }

  constructor (config: Config) {
    this.config = config
  }

  /**
   * 初始化
   */
  private init () {
    this.initPlugins(this.config.plugins || [])
    this.initPresets(this.config.presets || [])
  }

  /**
   * 初始化插件
   * @param plugins
   * @private
   */
  private initPlugins (plugins: ReturnType<Plugin>[]) {
    const pluginCtx = new PluginCtx(this)
    plugins.forEach(plugin => plugin(pluginCtx))
  }

  /**
   * 初始化预设
   * @param presets
   * @private
   */
  private initPresets (presets: ReturnType<Preset>[]) {
    const pluginCtx = new PluginCtx(this)
    presets.forEach(preset => {
      const { plugins } = preset(pluginCtx)
      this.initPlugins(plugins)
    })
  }
}
