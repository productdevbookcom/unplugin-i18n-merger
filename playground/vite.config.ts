import { defineConfig } from 'vite'
import Unplugin from '../src/unplugin/vite'

export default defineConfig({
  plugins: [
    Unplugin(),
  ],
})
