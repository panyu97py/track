import { Kernel } from './kernel'
import { AnyFn } from './types'

export class PluginCtx {
  private readonly ctx: Kernel

  constructor (ctx: Kernel) {
    this.ctx = ctx
    return this.initPropertyProxy()
  }

  private initPropertyProxy () {
    return new Proxy(this, {
      get: (target, property: string) => {
        if (!this.ctx.methods.has(property)) return target[property]
        const methods = this.ctx.methods.get(property) || []
        return (...arg:any[]) => {
          methods.forEach(item => {
            item.apply(this, arg)
          })
        }
      }
    })
  }

  registerMethod (name:string, fn: AnyFn) {
    const methods = this.ctx.methods.get(name) || []
    methods.push(fn)
    this.ctx.methods.set(name, methods)
  }

  applyMethod (name: string, opts?: any) {
    const methods = this.ctx.methods.get(name) || []
    methods.forEach(method => method.apply(this, opts))
  }
}
