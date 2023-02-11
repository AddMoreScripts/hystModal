import { resolve } from 'path'
import { defineConfig } from 'vite'

export default (({ mode }) => {
  return defineConfig({
    build: {
      lib: {
        entry: resolve(__dirname, './lib/hystmodal.ts'),
        name: 'HystModal',
        formats: [mode === 'browser' ? 'umd': 'es'],
        fileName: (format, entryName) => {
          return format === 'es' ? `${entryName}.esm.js` : `${entryName}.min.js`;
        },
      },
      emptyOutDir: mode !== 'browser',
      rollupOptions: {
        external: mode !== 'browser' ? ['tua-body-scroll-lock'] : [],
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'hystmodal.min.css';
            return assetInfo.name;
          },
        },
      },
    },
  });
});
