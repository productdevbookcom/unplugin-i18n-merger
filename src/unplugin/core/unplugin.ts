import { createUnplugin } from 'unplugin'
import type { ResolvedConfig } from 'vite'
import { slash } from '@antfu/utils'
import type { Options } from '../types'
import { createContext } from '../../context'

export default createUnplugin<Partial<Options>>((options) => {
  let ctx = createContext(options)
  return {
    name: 'unplugin-starter',
    enforce: 'post',
    vite: {
      async configResolved(config: ResolvedConfig) {
        if (ctx.root !== config.root) {
          ctx = createContext(options, config.root)
          await ctx.onScan()
        }
        await ctx.initFolders()
        await ctx.initSchemas()
        await ctx.initLanguages()
      },
      async handleHotUpdate({ file }) {
        if (slash(file).includes(slash(ctx.options.templateDir!)))
          await ctx.onScan()
      },
    },
    async buildStart() {
      await ctx.initFolders()
      await ctx.initSchemas()
      await ctx.initLanguages()
      await ctx.onScan()
    },
  }
})
