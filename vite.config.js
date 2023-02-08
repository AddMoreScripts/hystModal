// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './lib/hystmodal.ts'),
      name: 'HystModal',
      formats: ['es', 'umd'],
      fileName: (format, entryName) => {
        return format === 'es' ? `${entryName}.esm.js` : `${entryName}.min.js`;
      },
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'hystmodal.min.css';
          return assetInfo.name;
        },
      },
    },
  },
})
